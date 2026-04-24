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
	case IllegalUsername:
	case InsecurePassword:
	case WrongPassword:
	case ServerError:
	case UnknownUser:
	case InvalidSessionToken:
	case FrozenUser:
		return e.Error()
	}
	return ServerError.Error()
}

func MakeErrorCode(e error) string {
	// Currently the error code and message are the same
	return MakeErrorMessage(e)
}


