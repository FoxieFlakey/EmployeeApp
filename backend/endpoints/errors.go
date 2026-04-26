package endpoints

import (
	"backend/errors"
	"fmt"

	"github.com/gin-gonic/gin"
)

func MakeError(message string, err error) gin.H {
	return gin.H {
		"message": fmt.Sprintf("%s: %s", message, errors.MakeErrorMessage(err)),
		"code": errors.MakeErrorCode(err),
	}
}

