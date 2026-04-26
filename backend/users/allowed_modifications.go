package users

type AllowedChanges struct {
	Username bool
	Password bool
	DisplayName bool
	FullName bool
	Role bool
}

func GetAllowedChanges(subject *UserInfo, target *UserInfo) AllowedChanges {
	canChangeUsername := false
	canChangePassword := false
	canChangeDisplayName := false
	canChangeFullname := false
	canChangeRole := false
	
	switch subject.Role {
	case RoleAdmin:
		// Admin can change all details
		canChangeUsername = true
		canChangePassword = true
		canChangeDisplayName = true
		canChangeFullname = true
		canChangeRole = true
	// The rest of three roles dont have special
	// privileges to modify details
	case RoleHRD:
	case RoleAccounting:
	case RoleDeveloper:
	}
	
	if (subject.Id == target.Id) {
		canChangeUsername = true
		canChangeDisplayName = true
		canChangePassword = true
		
		// The authenticated user cannot change
		// their own role and fullname except
		// admins
		if (subject.Role != RoleAdmin) {
			canChangeFullname = false
			canChangeRole = false
		}
	}
	
	return AllowedChanges {
		Username: canChangeUsername,
		Password: canChangePassword,
		DisplayName: canChangeDisplayName,
		FullName: canChangeFullname,
		Role: canChangeRole,
	}
}

