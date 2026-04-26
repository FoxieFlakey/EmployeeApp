package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Request:
// GET /v1/users/:id/allowed_changes
//
// (list of any combination of these, may as well be empty)
// [ "username", "password", "display_name", "fullname", "role" ]
//
// Response (success):
// 200 Ok
//
// {
//   "username": <true/false>
//   "password": <true/false>
//   "display_name": <true/false>
//   "fullname": <true/false>
//   "role": <true/false>
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

func AllowedUserChanges(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("invalid user id", err))
		return
	}
	
	currentUser, err := GetCurrentUser(c)
	if err == errors.MissingAuthHeader {
		c.JSON(http.StatusUnauthorized, MakeError("you're unauthenticated", err))
		return
	}
	
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("cannot get current user", err))
		return
	}
	user, err := users.FindUserById(id)
	if err == errors.UnknownUser {
		c.JSON(http.StatusNotFound, MakeError("cannot find user", errors.UnknownUser))
		return
	}
	
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("cannot find user", err))
		return
	}
	
	allowedChanges := users.GetAllowedChanges(currentUser, user)
	
	c.JSON(http.StatusOK, gin.H {
		"username": allowedChanges.Username,
		"password": allowedChanges.Password,
		"display_name": allowedChanges.DisplayName,
		"fullname": allowedChanges.FullName,
		"role": allowedChanges.Role,
	})
}


