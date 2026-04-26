package middleware

import (
	"backend/endpoints"
	"backend/errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		currentUser, err := endpoints.GetCurrentUser(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, endpoints.MakeError("Cannot check user", err))
			return
		}
		
		if currentUser.IsFrozen {
			c.AbortWithStatusJSON(http.StatusForbidden, endpoints.MakeError("This user cannot be used because ", errors.FrozenUser))
			return
		}
		
		c.Next()
	}
}

