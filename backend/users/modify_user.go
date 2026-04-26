package users

import (
	"backend/errors"
	"backend/utils"
)

type ModifyUserParameters struct {
	Username *string `json:"username"`
	Password *string `json:"password"`
	DisplayName *string `json:"display_name"`
	FullName *string `json:"fullname"`
	Role *UserRole `json:"role" binding:"omitempty,oneof=Admin HRD Developer Accounting"`
}

func ModifyUser(subject *UserInfo, target *UserInfo, info ModifyUserParameters) error {
	allowedChanges := GetAllowedChanges(subject, target)
	
	if info.Password != nil {
		if allowedChanges.Password {
			if (len(*info.Password) < 10) {
				return errors.InsecurePassword
			}
		} else {
			return errors.MissingPrivileges
		}
	}
	
	if info.Username != nil {
		if allowedChanges.Username {
			if (len(*info.Username) < 3) {
				return errors.IllegalUsername
			}
		} else {
			return errors.MissingPrivileges
		}
	}
	
	if info.FullName != nil {
		if allowedChanges.FullName {
			if (len(*info.FullName) < 3) {
				return errors.IllegalFullname
			}
		} else {
			return errors.MissingPrivileges
		}
	}
	
	if info.DisplayName != nil {
		if allowedChanges.DisplayName {
			if (len(*info.DisplayName) < 3) {
				return errors.IllegalDisplayName
			}
		} else {
			return errors.MissingPrivileges
		}
	}
	
	if info.Role != nil && !allowedChanges.Role {
		return errors.MissingPrivileges
	}
	
	// Finally perform the actual modification
	username := utils.OrDefault(info.Username, target.Username)
	fullname := utils.OrDefault(info.FullName, target.FullName)
	displayName := utils.OrDefault(info.DisplayName, target.DisplayName)
	role := utils.OrDefault(info.Role, target.Role)
	var passwordHash string
	
	if info.Password != nil {
		passwordHash = utils.HashPassword(*info.Password)
	} else {
		passwordHash = target.PasswordHash
	}
	
	return UpdateUser(&UserInfo {
		Id: target.Id,
		Username: username,
		FullName: fullname,
		DisplayName: displayName,
		PasswordHash: passwordHash,
		Role: role,
	})
}

