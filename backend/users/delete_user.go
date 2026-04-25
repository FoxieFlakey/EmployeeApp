package users

import (
	"backend/errors"
	"backend/state"
)

func DeleteUserById(id int64) error {
	tx, err := state.Database.Begin()
	
	// Delete the sessions for a user, then finally delete
	// the user themselves
	result, err := tx.Exec(
		"DELETE FROM LoggedInSessions WHERE user_id=$1",
		id,
	)
	
	if err != nil {
		return err
	}
	
	result, err = state.Database.Exec(
		"DELETE FROM Users WHERE id=$1",
		id,
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
	
	return tx.Commit()
}

