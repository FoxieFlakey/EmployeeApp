package endpoints

import (
	"backend/errors"
	"backend/users"
	"strings"

	"github.com/gin-gonic/gin"
)

// Checks the role of current authenticated user
// return true, if the current authenticated user has the role
func checkRole(c *gin.Context, required users.UserRole) bool {
	currentUser, _ := GetCurrentUser(c)
	if currentUser == nil {
		return false
	}
	return currentUser.Role == required
}

func GetCurrentSession(c *gin.Context) (*string, error) {
	authHeader := c.GetHeader("Authorization")
	
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, errors.MissingAuthHeader
	}
	
	token := strings.TrimPrefix(authHeader, "Bearer ")
	return &token, nil
}

func GetCurrentUser(c *gin.Context) (*users.UserInfo, error) {
	token, err := GetCurrentSession(c)
	if err != nil {
		return nil, err
	}
	
	info, err := users.GetUserInfoFromSessionToken(*token)
	
	if err != nil {
		return nil, err
	}
	
	return info, nil
}

