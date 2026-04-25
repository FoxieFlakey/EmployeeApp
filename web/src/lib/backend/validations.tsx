import { UserList } from "./list_user"
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

export function validateUserList(object: unknown): UserList | null {
  if (object == null || typeof object != "object") {
    return null
  }
  
  if (
    !("users" in object) ||
    !Array.isArray(object.users) ||
    object.users.find((val) => !(typeof val == "bigint"))
  ) {
    return null
  }
  
  return object as UserList
}

export function validateUserInfoObject(object: unknown): UserInfo | null {
  if (object == null || typeof object != "object") {
    return null
  }
  
  if (
    !("id" in object) ||
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

