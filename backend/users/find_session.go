package users

import (
	"backend/state"
	"database/sql"
	"errors"
	"time"
)

var TokenIsInvalid = errors.New("TokenIsInvalid")

func GetUserInfoFromSessionToken(token string) (*UserInfo, error) {
	var userId int64
	var expireAt time.Time
	
	err := state.Database.QueryRow(
		"SELECT user_id, expire_at FROM LoggedInSessions WHERE session_token=$1",
		token,
	).Scan(&userId, &expireAt)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, TokenIsInvalid
		}
		
		return nil, err
	}
	
	if expireAt.Before(time.Now()) {
		// Token is expired
		return nil, TokenIsInvalid
	}
	
	return FindUserById(userId)
}

