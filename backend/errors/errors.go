package errors

import (
	"errors"

	"github.com/go-playground/validator/v10"
)

var DuplicateUsername = errors.New("DuplicateUsername")
var IllegalUsername = errors.New("IllegalUsername")
var IllegalDisplayName = errors.New("IllegalDisplayName")
var IllegalFullname = errors.New("IllegalFullname")
var ValidationError = errors.New("ValidationError")
var InsecurePassword = errors.New("InsecurePassword")
var WrongPassword = errors.New("WrongPassword")
var ServerError = errors.New("ServerError")
var UnknownUser = errors.New("UnknownUser")
var InvalidSessionToken = errors.New("InvalidSessionToken")
var FrozenUser = errors.New("FrozenUser")
var MissingAuthHeader = errors.New("MissingAuthHeader")
var MissingPrivileges = errors.New("MissingPrivileges")

// This function will turn any unknown error
// into ServerError
func MakeErrorMessage(e error) string {
	var valErr validator.ValidationErrors
	if errors.As(e, &valErr) {
		return e.Error()
	}
	
	switch e {
	case DuplicateUsername:
		return e.Error()
	case IllegalUsername:
		return e.Error()
	case InsecurePassword:
		return e.Error()
	case WrongPassword:
		return e.Error()
	case ServerError:
		return e.Error()
	case UnknownUser:
		return e.Error()
	case InvalidSessionToken:
		return e.Error()
	case FrozenUser:
		return e.Error()
	case ValidationError:
		return e.Error()
	case IllegalFullname:
		return e.Error()
	case IllegalFullname:
		return e.Error()
	case MissingPrivileges:
		return e.Error()
	default:
		return "Server dont have proper error message"
	}
}

func MakeErrorCode(e error) string {
	var valErr validator.ValidationErrors
	if errors.As(e, &valErr) {
		return ValidationError.Error()
	}
	
	switch e {
	case DuplicateUsername:
	case IllegalUsername:
	case InsecurePassword:
	case WrongPassword:
	case ServerError:
	case UnknownUser:
	case InvalidSessionToken:
	case FrozenUser:
	case ValidationError:
	case IllegalFullname:
	case IllegalFullname:
	case MissingPrivileges:
	default:
		e = ServerError
	}
	
	// Currently the error code and message are the same
	return MakeErrorMessage(e)
}


