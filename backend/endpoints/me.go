package endpoints

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Me(c *gin.Context) {
	current, err := GetCurrentUser(c)
	
	if current == nil {
		c.JSON(http.StatusBadRequest, MakeError("Cannot retrieve current user", err))
		return
	}
	
	c.JSON(http.StatusOK, gin.H {
		"id": current.Id,
		"username": current.Username,
		"display_name": current.DisplayName,
		"fullname": current.FullName,
		"role": current.Role,
		"is_frozen": current.IsFrozen,
	})
}

