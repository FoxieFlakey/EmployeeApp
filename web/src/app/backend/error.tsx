'use client';

export enum ErrorCode {
  DuplicateUsername = "DuplicateUsername",
  IllegalUsername = "IllegalUsername",
  InsecurePassword = "InsecurePassword",
  WrongPassword = "WrongPassword",
  ServerError = "ServerError",
  UnknownUser = "UnknownUser",
  InvalidSessionToken = "InvalidSessionToken",
  FrozenUser = "FrozenUser",
  MissingAuthHeader = "MissingAuthHeader",
  MissingPrivileges = "MissingPrivileges"
}

export interface Error {
  code: ErrorCode,
  message: string
}

export function validateErrorResponse(response: object): Error {
  if ("code" in response && "message" in response) {
    return response as Error
  }
  
  return {
    code: ErrorCode.ServerError,
    message: "Server returned invalid error object"
  }
}

