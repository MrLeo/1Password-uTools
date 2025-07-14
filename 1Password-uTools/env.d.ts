/// <reference types="vite/client" />
/// <reference types="utools-api-types" />

import type { Category, Item, User, Vault } from './src/types'

declare global {
  interface Window {
    utools: UToolsApi
    $node: {
      fs: typeof import('node:fs')
      path: typeof import('node:path')
      child_process: typeof import('node:child_process')
    }
    $onePassword: OnePassword
  }
}

interface OnePassword {
  checkPathExists: (filePath: string) => boolean
  getCliPath: (paths: (string | undefined)[]) => string | undefined
  executeOp: (
    cliPath: string,
    args: string[],
    options?: Record<string, any>,
  ) => {
    success: boolean
    data: any
    error?: string
  }
  executeCommand: (
    command: string,
    options?: Record<string, any>,
  ) => {
    success: boolean
    data: any
    error?: string
  }
  checkSignInStatus: (cliPath: string) => boolean
  signIn: (
    cliPath: string,
    account?: string,
    shellPath?: string,
  ) => {
    success: boolean
    data: any
    error?: string
  }
  getPasswords: (
    cliPath: string,
    flags?: string[],
  ) => {
    success: boolean
    data: Item[]
    error?: string
  }
  getVaults: (cliPath: string) => {
    success: boolean
    data: Vault[]
    error?: string
  }
  getCategories: (cliPath: string) => {
    success: boolean
    data: Category[]
    error?: string
  }
  getAccount: (cliPath: string) => {
    success: boolean
    data: User
    error?: string
  }
  getAccounts: (cliPath: string) => {
    success: boolean
    data: User[]
    error?: string
  }
}
