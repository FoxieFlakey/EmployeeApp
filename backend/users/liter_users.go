package users

import (
	"backend/state"
	"database/sql"
)

type UsersIterator struct {
	rows *sql.Rows
	err error
}

func (self *UsersIterator) Close() {
	self.rows.Close()
}

func (self *UsersIterator) Err() error {
	if self.err != nil {
		return self.err
	}
	
	return self.rows.Err()
}

func (self *UsersIterator) Next() *UserInfo {
	if self.Err() != nil {
		return nil
	}
	
	var id int64
	var username string
	var fullname string
	var display_name string
	var user_role string
	var is_frozen bool
	var password_hash string
	
	if self.rows.Next() == false {
		return nil
	}
	
	err := self.rows.Scan(&id, &username, &fullname, &display_name, &user_role, &is_frozen, &password_hash)
	if err != nil {
		self.err = err
		return nil
	}
	
	return &UserInfo {
		Id: id,
		Username: username,
		DisplayName: display_name,
		FullName: fullname,
		PasswordHash: password_hash,
		IsFrozen: is_frozen,
		Role: UserRole(user_role),
	}
}

func IterateAllUsers() (*UsersIterator, error) {
	rows, err := state.Database.Query(
		"SELECT id, username, fullname, display_name, user_role, is_frozen, password_hash " +
		"FROM Users ORDER BY id ASC",
	)
	
	if err != nil {
		return nil, err
	}
	
	return &UsersIterator {
		rows: rows,
		err: nil,
	}, nil
}


