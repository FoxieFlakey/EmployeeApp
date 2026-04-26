package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	if !checkRole(c, users.RoleHRD) && !checkRole(c, users.RoleAdmin) {
		// only Admin and HRD can create users
		c.JSON(http.StatusUnauthorized, MakeError("only Admin or HRD, allowed to make new users", errors.MissingPrivileges))
		return
	}
	
	var body users.CreateInfo
	
	err := c.ShouldBindJSON(&body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("invalid request", err))
		return
	}
	
	err = users.CreateUser(&body)
	
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("Error creating user", err))
		return
	}
	c.Status(http.StatusCreated)
}

