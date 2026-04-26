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
	if !checkRole(c, users.RoleHRD) && !checkRole(c, users.RoleAdmin) {
		// only Admin and HRD can list users
		c.JSON(http.StatusUnauthorized, MakeError("only Admin or HRD, allowed to list new users", errors.MissingPrivileges))
		return
	}
	
	iter, err := users.IterateAllUsers()
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("server error", err))
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


