'use client';

export type Success<T> = {
  ok: true,
  value: T
}

export type Failed<E> = {
  ok: false,
  value: E
}

export type Result<T, E> = Success<T> | Failed<E>

export function ok<T, E>(val: T): Result<T, E> {
  return {
    ok: true,
    value: val
  }
}

export function failed<T, E>(val: E): Result<T, E> {
  return {
    ok: false,
    value: val
  }
}

export function unwrap_err<T, E>(result: Result<T, E>): E {
  if (result.ok) {
    throw "Attempt to unwrap non failed result"
  }
  
  return result.value as E
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (!result.ok) {
    throw "Attempt to unwrap non success result"
  }
  
  return result.value as T
}

