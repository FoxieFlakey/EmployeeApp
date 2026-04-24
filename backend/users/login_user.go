package users

import (
	"backend/errors"
	"backend/utils"
)

type LoginInfo struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Returns session token that can be used to authenticate
// other request
func Login(info LoginInfo) (*string, error) {
	user, err := FindUser(info.Username)
	if err != nil {
		return nil, err
	}
	
	if user == nil {
		return nil, errors.UnknownUser
	}
	
	if user.IsFrozen {
		return nil, errors.FrozenUser
	}
	
	if !utils.CheckPassword(info.Password, user.PasswordHash) {
		return nil, errors.WrongPassword
	}
	
	return CreateSession(*user)
}

