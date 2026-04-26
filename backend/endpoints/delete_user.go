package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Request:
// DELETE /v1/user/:id
//
// Response (success):
// 200 Ok
//
// {}
//
// Response (failed):
// 400 Bad Request
//
// {
//   "code": "...",
//   "message": "..."
// }
//

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
	
	c.JSON(http.StatusOK, gin.H {})
}

