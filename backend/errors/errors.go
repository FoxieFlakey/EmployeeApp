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

