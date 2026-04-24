package users

import (
	"backend/state"
	"backend/utils"
	"errors"
)

var DuplicateUsername = errors.New("DuplicateUsername")
var IllegalUsernam = errors.New("IllegalUsernam")
var InsecurePasswor = errors.New("InsecurePasswor")
var ServerErro = errors.New("ServerErro")

func CreateUser(info *UserInfo) (error) {
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
		return DuplicateUsername;
	}
	
	return nil
}

