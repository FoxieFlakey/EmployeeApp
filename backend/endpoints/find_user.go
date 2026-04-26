package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func FindUser(c *gin.Context) {
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
		c.JSON(http.StatusBadRequest, MakeError("invalid request", err))
		return
	}
	
	if currentUser.IsFrozen {
		c.JSON(http.StatusUnauthorized, MakeError("not allowed because ", errors.FrozenUser))
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
	
	c.JSON(http.StatusOK, gin.H {
		"id": user.Id,
		"username": user.Username,
		"display_name": user.DisplayName,
		"fullname": user.FullName,
		"role": user.Role,
		"is_frozen": user.IsFrozen,
	})
}

