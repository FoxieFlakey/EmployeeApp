package endpoints

import "github.com/gin-gonic/gin"

func makeError(message string) gin.H {
	return gin.H {
		"message": message,
	}
}

