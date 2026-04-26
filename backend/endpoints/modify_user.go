package endpoints

import (
	"backend/errors"
	"backend/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ModifyUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("invalid user id", err))
		return
	}
	
	var body users.ModifyUserParameters
	err = c.ShouldBindJSON(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("Invalid request", err))
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
	
	err = users.ModifyUser(currentUser, user, body)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("cannot modify user", err))
		return
	}
	
	c.Status(http.StatusNoContent)
}

