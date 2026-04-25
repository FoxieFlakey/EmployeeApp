// This is folder contains codes for for interacting with backend
// it does not interact with NextJS nor React in
// anyway, purely as abstraction layer so other
// codes only need to calls its methods instead
// manually doing HTTP fetch calls
'use client';

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
  me
}

