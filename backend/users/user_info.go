package users

type UserRole string
const (
	RoleAdmin UserRole = "Admin"
	RoleHRD UserRole = "HRD"
	RoleDeveloper UserRole = "Developer"
	RoleAccounting UserRole = "Accounting"
)

type UserInfo struct {
	Username string;
	FullName string;
	DisplayName string;
	Password string;
	Role UserRole;
}


