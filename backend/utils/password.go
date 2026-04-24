package utils

import (
	"crypto/subtle"
	"encoding/base64"
	"fmt"

	"golang.org/x/crypto/argon2"
)

// For now salt is 8 bytes of letter 'A'
var salt = []byte("AAAAAAAA");

var argonMemory = uint32(64 * 1024)
var argonTime = uint32(3)
var argonParallelization = uint8(4)
var keyLen = uint32(32)

func HashPassword(password string) string {
	payload := argon2.IDKey([]byte(password), salt[:], argonTime, argonMemory, argonParallelization, keyLen)
	
	// According to https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
	// this is the format :3
	return fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		argonMemory,
		argonTime,
		argonParallelization,
		base64.RawStdEncoding.EncodeToString(salt[:]),
		base64.RawStdEncoding.EncodeToString(payload),
	)
}

func CheckPassword(password string, hashed string) bool {
	return subtle.ConstantTimeCompare([]byte(HashPassword(password)), []byte(hashed)) == 1
}

