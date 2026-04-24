import { UserInfo, UserRole } from "./lib"

export function validateUserRole(role: unknown): UserRole | null {
  if (role == null || typeof role != "string") {
    return null
  }
  
  switch (role) {
  case "Admin":
  case "HRD":
  case "Developer":
  case "Accounting":
    return role as UserRole
  default:
    return null
  }
}

export function validateUserInfoObject(object: unknown): UserInfo | null {
  if (object == null || typeof object != "object") {
    return null
  }
  
  if (
    !("username" in object) ||
    !("display_name" in object) ||
    !("fullname" in object) ||
    !("role" in object) ||
    !("is_frozen" in object) ||
    validateUserRole(object.role) == null
  ) {
    return null
  }
  
  return object as UserInfo
}

