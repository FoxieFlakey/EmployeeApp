package users

import (
	"backend/errors"
	"backend/state"
)

func RemoveSession(session string) error {
	result, err := state.Database.Exec(
		"DELETE FROM LoggedInSessions WHERE session_token=$1",
		session,
	)
	
	if err != nil {
		return err
	}
	
	count, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if count == 0 {
		return errors.InvalidSessionToken
	}
	
	return nil
}

