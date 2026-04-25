'use client'

export function getSessionToken(): string | null {
  return localStorage.getItem("sessionToken")
}

export function setSessionToken(token: string) {
  localStorage.setItem("sessionToken", token)
}

export function removeSessionToken() {
  localStorage.removeItem("sessionToken")
}

