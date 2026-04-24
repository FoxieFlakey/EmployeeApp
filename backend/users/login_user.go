package users

import (
	"backend/utils"
	"errors"
)

type LoginInfo struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

var UnknownUser = errors.New("UnknownUser")
var FrozenUser = errors.New("UserIsFrozen")
var InvalidPassword = errors.New("InvalidPassword")
var ServerError = errors.New("ServerError")

// Returns session token that can be used to authenticate
// other request
func Login(info LoginInfo) (*string, error) {
	user, err := FindUser(info.Username)
	if err != nil {
		return nil, err
	}
	
	if user == nil {
		return nil, UnknownUser
	}
	
	if user.IsFrozen {
		return nil, FrozenUser
	}
	
	if !utils.CheckPassword(info.Password, user.PasswordHash) {
		return nil, InvalidPassword
	}
	
	token, err := CreateSession(*user)
	if err != nil {
		return nil, err
	}
	
	return token, nil
}

