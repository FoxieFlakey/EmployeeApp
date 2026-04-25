package users

import (
	"backend/errors"
	"backend/state"
	"database/sql"
)

func FindUserById(id int64) (*UserInfo, error) {
	var username string
	var fullname string
	var display_name string
	var user_role string
	var is_frozen bool
	var password_hash string
	
	err := state.Database.QueryRow(
		"SELECT username, fullname, display_name, user_role, is_frozen, password_hash FROM Users WHERE id=$1",
		id,
	).Scan(&username, &fullname, &display_name, &user_role, &is_frozen, &password_hash)
	
	if err == sql.ErrNoRows {
		return nil, errors.UnknownUser
	}
	
	if err != nil {
		return nil, err
	}
	
	return &UserInfo {
		Id: id,
		Username: username,
		DisplayName: display_name,
		FullName: fullname,
		PasswordHash: password_hash,
		Role: UserRole(user_role),
		IsFrozen: is_frozen,
	}, nil
}

func FindUser(username string) (*UserInfo, error) {
	var id int64
	var fullname string
	var display_name string
	var user_role string
	var is_frozen bool
	var password_hash string
	
	err := state.Database.QueryRow(
		"SELECT id, fullname, display_name, user_role, is_frozen, password_hash FROM Users WHERE username=$1",
		username,
	).Scan(&id, &fullname, &display_name, &user_role, &is_frozen, &password_hash)
	
	if err == sql.ErrNoRows {
		return nil, errors.UnknownUser
	}
	
	if err != nil {
		return nil, err
	}
	
	return &UserInfo {
		Id: id,
		Username: username,
		DisplayName: display_name,
		FullName: fullname,
		PasswordHash: password_hash,
		Role: UserRole(user_role),
		IsFrozen: is_frozen,
	}, nil
}

