package endpoints

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Request:
// GET /v1/me
//
// Response (success):
// 200 Ok
//
// {
//   "username": "...",
//   "display_name": "...",
//   "fullname": "...",
//   "role": "<one of 'Admin' or 'HRD' or 'Developer' or 'Accounting'>",
//   "is_frozen": ...
// }
//
// Response (failed):
// 400 Bad Request
//
// {
//   "message": "..."
// }
//

func Me(c *gin.Context) {
	current := getCurrentUser(c)
	
	if current == nil {
		c.JSON(http.StatusBadRequest, makeError("Cannot retrieve current user"))
		return
	}
	
	c.JSON(http.StatusOK, gin.H {
		"username": current.Username,
		"display_name": current.DisplayName,
		"fullname": current.FullName,
		"role": current.Role,
		"is_frozen": current.IsFrozen,
	})
}

