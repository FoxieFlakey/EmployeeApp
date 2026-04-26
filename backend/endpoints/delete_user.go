package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func DeleteUser(c *gin.Context) {
	if !checkRole(c, users.RoleAdmin) {
		// only Admin can delete users
		c.JSON(http.StatusUnauthorized, MakeError("only Admin, allowed to delete users", errors.MissingPrivileges))
		return
	}
	
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("invalid user id", err))
		return
	}
	
	_, err = users.FindUserById(id)
	if err == errors.UnknownUser {
		c.JSON(http.StatusNotFound, MakeError("cannot find user", errors.UnknownUser))
		return
	}
	
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("cannot find user", err))
		return
	}
	
	err = users.DeleteUserById(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("cannot delete user", err))
		return
	}
	
	c.Status(http.StatusNoContent)
}

