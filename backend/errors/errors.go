package errors

import "errors"

var DuplicateUsername = errors.New("DuplicateUsername")
var IllegalUsername = errors.New("IllegalUsername")
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
	default:
		return ServerError.Error()
	}
}

func MakeErrorCode(e error) string {
	// Currently the error code and message are the same
	return MakeErrorMessage(e)
}


