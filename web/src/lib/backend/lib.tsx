// This is folder contains codes for for interacting with backend
// it does not interact with NextJS nor React in
// anyway, purely as abstraction layer so other
// codes only need to calls its methods instead
// manually doing HTTP fetch calls
'use client';

import { freeze_user, unfreeze_user } from "./freeze_unfreezer_user";
import { delete_user } from "./delete_user";
import { create_user } from "./create_user";
import { find_user } from "./find_user";
import { list_users } from "./list_user";
import { get_allowed_changes_to_user } from "./allowed_changes";
import { modify_user } from "./modify_user";
import { login } from "./login";
import { me } from "./me";

export enum UserRole {
  Admin = "Admin",
  HRD = "HRD",
  Developer = "Developer",
  Accounting = "Accounting"
}

export interface UserInfo {
  id: BigInt,
  username: string,
  display_name: string,
  fullname: string,
  role: UserRole,
  is_frozen: boolean
}

export default {
  login,
  list_users,
  find_user,
  freeze_user,
  unfreeze_user,
  delete_user,
  create_user,
  get_allowed_changes_to_user,
  modify_user,
  me
}

