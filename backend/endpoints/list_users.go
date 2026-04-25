package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Request:
// GET /v1/users/:id/profile
//
// Response (success):
// 200 Ok
//
// {
//   "users": [
//     1,
//     2,
//     9,
//     .. so on till all users ..
//   ]
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

func ListUsers(c *gin.Context) {
	currentUser, err := getCurrentUser(c)
	if err == errors.MissingAuthHeader {
		c.JSON(http.StatusUnauthorized, makeError("you're unauthenticated", err))
		return
	}
	
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError("invalid request", err))
		return
	}
	
	if currentUser.Role != users.RoleAdmin && currentUser.Role != users.RoleHRD {
		c.JSON(http.StatusUnauthorized, makeError("missing privilege", errors.MissingPrivileges))
		return
	}
	
	iter, err := users.IterateAllUsers()
	if err != nil {
		c.JSON(http.StatusBadRequest, makeError("server error", err))
		return
	}
	
	defer iter.Close()
	
	listOfUserIDs := []int64{}
	
	for {
		user := iter.Next()
		if user == nil {
			break
		}
		
		listOfUserIDs = append(listOfUserIDs, user.Id)
	}
	
	c.JSON(http.StatusOK, gin.H {
		"users": listOfUserIDs,
	})
}


