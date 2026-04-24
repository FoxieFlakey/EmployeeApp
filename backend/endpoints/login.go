package endpoints

import (
	"backend/users"
	"fmt"
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
//   "message": "..."
// }
//

func Login(c *gin.Context) {
	var body users.LoginInfo
	
	err := c.ShouldBindJSON(&body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError(fmt.Sprintf("invalid request: %s", err)))
		return
	}
	
	sessionToken, err := users.Login(body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError(fmt.Sprintf("error logging in: %s", err)))
		return
	}
	
	c.JSON(http.StatusOK, gin.H {
		"session_token": sessionToken,
	})
}


