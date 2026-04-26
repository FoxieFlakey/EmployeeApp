package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"

	"github.com/gin-gonic/gin"
)

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


