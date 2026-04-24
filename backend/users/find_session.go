package users

import (
	"backend/errors"
	"backend/state"
	"database/sql"
	"time"
)

func GetUserInfoFromSessionToken(token string) (*UserInfo, error) {
	var userId int64
	var expireAt time.Time
	
	err := state.Database.QueryRow(
		"SELECT user_id, expire_at FROM LoggedInSessions WHERE session_token=$1",
		token,
	).Scan(&userId, &expireAt)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.InvalidSessionToken
		}
		
		return nil, err
	}
	
	if expireAt.Before(time.Now()) {
		// Token is expired
		return nil, errors.InvalidSessionToken
	}
	
	return FindUserById(userId)
}

