package endpoints

import (
	"backend/users"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Request:
// POST /v1/create_user
//
// {
//   "username": "...",
//   "password": "...",
//   "display_name": "...",
//   "fullname": "...",
//   "role": "<one of 'Admin' or 'HRD' or 'Developer' or 'Accounting'>"
// }
//
// Response (success):
// 201 Created
//
// {}
//
// Response (failed):
// 400 Bad Request
//
// {
//   "message": "..."
// }
//
func CreateUser(c *gin.Context) {
	var body users.CreateInfo
	
	err := c.ShouldBindJSON(&body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError(fmt.Sprintf("invalid request: %s", err)))
		return
	}
	
	err = users.CreateUser(&body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError(fmt.Sprintf("Error creating user: %s", err)))
		return
	}
	c.JSON(http.StatusCreated, gin.H {})
}

