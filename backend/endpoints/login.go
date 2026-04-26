package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var body users.LoginInfo
	
	err := c.ShouldBindJSON(&body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("invalid request", err))
		return
	}
	
	sessionToken, err := users.Login(body)
	
	if err != nil {
		status := http.StatusBadRequest
		if err == errors.WrongPassword {
			status = http.StatusUnauthorized
		}
		
		c.JSON(status, MakeError("error logging in", err))
		return
	}
	
	c.JSON(http.StatusOK, gin.H {
		"session_token": sessionToken,
	})
}


