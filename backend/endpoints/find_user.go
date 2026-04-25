package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Request:
// GET /v1/users/:id/profile
//
// Response (success):
// 200 Ok
//
// {
//   "id": "...",
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
//   "code": "...",
//   "message": "..."
// }
//
//
// incase of unauthenticated
// 401 Unauthorized
//
// {
//   "code": "...",
//   "message": "..."
// }
//
// incase of not enough privilege
// 403 Forbidden
//
// {
//   "code": "...",
//   "message": "..."
// }
func FindUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError("invalid user id", err))
		return
	}
	
	currentUser, err := getCurrentUser(c)
	if err == errors.MissingAuthHeader {
		c.JSON(http.StatusUnauthorized, makeError("you're unauthenticated", err))
		return
	}
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError("invalid request", err))
		return
	}
	
	if currentUser.IsFrozen {
		c.JSON(http.StatusUnauthorized, makeError("not allowed because ", errors.FrozenUser))
		return
	}
	
	user, err := users.FindUserById(id)
	if err == errors.UnknownUser {
		c.JSON(http.StatusNotFound, makeError("cannot find user", errors.UnknownUser))
		return
	}
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError("cannot find user", err))
		return
	}
	
	c.JSON(http.StatusOK, gin.H {
		"id": user.Id,
		"username": user.Username,
		"display_name": user.DisplayName,
		"fullname": user.FullName,
		"role": user.Role,
		"is_frozen": user.IsFrozen,
	})
}

