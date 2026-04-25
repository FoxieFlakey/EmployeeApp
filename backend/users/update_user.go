package users

import (
	"backend/errors"
	"backend/state"
)

func UpdateUser(user *UserInfo) error {
	result, err := state.Database.Exec(
		"UPDATE Users " +
		"SET username=$1,fullname=$2,display_name=$3,user_role=$4,is_frozen=$5,password_hash=$6 " +
		"WHERE id=$7",
		user.Username, user.FullName, user.DisplayName, user.Role, user.IsFrozen, user.PasswordHash, user.Id,
	)
	
	if err != nil {
		return err
	}
	
	count, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if count == 0 {
		return errors.UnknownUser
	}
	
	return nil
}


