package users

import (
	"backend/errors"
	"backend/state"
	"backend/utils"
)

type CreateInfo struct {
	Username string `json:"username" binding:"required"`
	FullName string `json:"fullname" binding:"required"`
	DisplayName string `json:"display_name"`
	Password string `json:"password" binding:"required"`
	Role UserRole `json:"role" binding:"required,oneof=Admin HRD Developer Accounting"`;
}

func CreateUser(info *CreateInfo) (error) {
	if (len(info.Password) < 10) {
		return errors.InsecurePassword
	}
	
	if (len(info.Username) < 3) {
		return errors.IllegalUsername
	}
	
	if (len(info.FullName) < 3) {
		return errors.IllegalFullname
	}
	
	if (len(info.DisplayName) < 3) {
		return errors.IllegalDisplayName
	}
	
	hashedPassword := utils.HashPassword(info.Password);
	
	result, err := state.Database.Exec(
		"INSERT INTO Users (username, fullname, display_name, user_role, password_hash) " +
		"VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO NOTHING",
		info.Username, info.FullName, info.DisplayName, info.Role, hashedPassword,
	)
	
	if err != nil {
		return err;
	}
	
	count, err := result.RowsAffected()
	if err != nil {
		return err;
	}
	
	if count == 0 {
		// There duplicate user because nothing was done
		return errors.DuplicateUsername;
	}
	
	return nil
}

