package users

type UserRole string
const (
	RoleAdmin UserRole = "Admin"
	RoleHRD UserRole = "HRD"
	RoleDeveloper UserRole = "Developer"
	RoleAccounting UserRole = "Accounting"
)

type UserInfo struct {
	Id int64;
	Username string;
	FullName string;
	DisplayName string;
	PasswordHash string;
	Role UserRole;
	IsFrozen bool;
}


