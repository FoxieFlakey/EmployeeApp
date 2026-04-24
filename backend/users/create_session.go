package users

import (
	"backend/errors"
	"backend/state"
	"backend/utils"
	"time"
)

func CreateSession(user UserInfo) (*string, error) {
	// Keep repeating atleast 5 times
	attempt := 0
	for attempt < 5 {
		attempt++;
		
		sessionToken, err := utils.GenerateRandomHex(32)
		if err != nil {
			return nil, err
		}
		
		result, err := state.Database.Exec(
			"INSERT INTO LoggedInSessions (session_token, user_id, expire_at) " +
			"VALUES ($1, $2, $3) "+
			"ON CONFLICT (session_token) DO NOTHING",
			sessionToken,
			user.Id,
			// Valid for only a month
			time.Now().Add(time.Hour * 24 * 30),
		)
		
		count, err := result.RowsAffected()
		if err != nil {
			return nil, err
		}
		
		if count == 1 {
			return sessionToken, nil
		}
	}
	
	// Couldn't generate unique session token
	// in 5 tries (should almost never occured)
	return nil, errors.ServerError
}

