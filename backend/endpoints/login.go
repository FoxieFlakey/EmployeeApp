package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Request:
// POST /v1/login
//
// {
//   "username": "...",
//   "password": "..."
// }
//
// Response (success):
// 200 Ok
//
// {
//   "session_token": "<token...>"
// }
//
// Response (failed):
// 400 Bad Request
//
// {
//   "code": "...",
//   "message": "..."
// }
//
//
// Or incase of wrong password
// 401 Unauthorized
//
// {
//   "code": "...",
//   "message": "..."
// }

func Login(c *gin.Context) {
	var body users.LoginInfo
	
	err := c.ShouldBindJSON(&body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError("invalid request", err))
		return
	}
	
	sessionToken, err := users.Login(body)
	
	if err != nil {
		status := http.StatusBadRequest
		if err == errors.WrongPassword {
			status = http.StatusUnauthorized
		}
		
		c.JSON(status, makeError("error logging in", err))
		return
	}
	
	c.JSON(http.StatusOK, gin.H {
		"session_token": sessionToken,
	})
}


