package users

import (
	"backend/state"
	"database/sql"
	"fmt"
)

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
		return nil, UnknownUser
	}
	
	if err != nil {
		fmt.Printf("A: %s\n", err)
		return nil, err
	}
	
	return &UserInfo {
		Id: id,
		Username: username,
		DisplayName: display_name,
		FullName: fullname,
		PasswordHash: password_hash,
		Role: UserRole(user_role),
	}, nil
}

