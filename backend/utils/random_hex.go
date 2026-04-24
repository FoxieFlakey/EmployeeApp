package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateRandomHex(byteCount int) (*string, error) {
	rawBytes := make([]byte, byteCount)
	_, err := rand.Read(rawBytes)
	if err != nil {
		return nil, err
	}
	
	encoded := hex.EncodeToString(rawBytes)
	return &encoded, nil
}

