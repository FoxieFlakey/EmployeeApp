package endpoints

import (
	"backend/users"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	token, err := GetCurrentSession(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("cannot logout", err))
		return
	}
	
	err = users.RemoveSession(*token)
	if err != nil {
		c.JSON(http.StatusBadRequest, MakeError("cannot logout", err))
		return
	}
	
	c.Status(http.StatusNoContent)
}

