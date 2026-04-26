package utils

func OrDefault[T any](nilable *T, defaultValue T) T {
	if nilable == nil {
		return defaultValue
	}
	
	return *nilable
}

