package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func FreezeUser(c *gin.Context) {
	freezeImpl(c, true)
}

func UnfreezeUser(c *gin.Context) {
	freezeImpl(c, false)
}

func freezeImpl(c *gin.Context, freeze bool) {
	if freeze {
		if !checkRole(c, users.RoleHRD) && !checkRole(c, users.RoleAdmin) {
			// only Admin and HRD can freeze users
			c.JSON(http.StatusUnauthorized, MakeError("only Admin or HRD, allowed to make freeze users", errors.MissingPrivileges))
			return
		}
	} else {
		if !checkRole(c, users.RoleAdmin) {
			// only Admin can ufreeze users
			c.JSON(http.StatusUnauthorized, MakeError("only Admin, allowed to unfreeze users", errors.MissingPrivileges))
			return
		}
	}
	
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("invalid user id", err))
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
	
	if user.IsFrozen != freeze {
		user.IsFrozen = freeze
		
		// Freeze if user hasn't been froze
		err := users.UpdateUser(user) 
		if err != nil {
			c.JSON(http.StatusBadRequest, MakeError("cannot update user's state", err))
			return
		}
	}
	
	c.Status(http.StatusNoContent)
}


