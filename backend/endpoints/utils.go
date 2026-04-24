package endpoints

import (
	"backend/users"
	"strings"

	"github.com/gin-gonic/gin"
)

// Checks the role of current authenticated user
// return true, if the current authenticated user has the role
func checkRole(c *gin.Context, required users.UserRole) bool {
	currentUser := getCurrentUser(c)
	if currentUser == nil {
		return false
	}
	return currentUser.Role == required
}

func getCurrentUser(c *gin.Context) *users.UserInfo {
	authHeader := c.GetHeader("Authorization")
	
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil
	}
	
	info, err := users.GetUserInfoFromSessionToken(strings.TrimPrefix(authHeader, "Bearer "))
	
	if err != nil {
		return nil
	}
	
	return info
}

