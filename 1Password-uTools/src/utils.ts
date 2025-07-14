import type { ActionID, AppPreferences, CategoryName, Item } from './types'

// Default preferences
const defaultPreferences: AppPreferences = {
  version: 'v8',
  primaryAction: 'open-in-1password',
  secondaryAction: 'open-in-browser',
  closeWindowAfterCopying: true,
  cliPath: '',
  zshPath: '/bin/zsh',
}

// Use localStorage to store preferences
export function getPreferences(): AppPreferences {
  const storedPrefs = localStorage.getItem('1password-preferences')
  if (storedPrefs) {
    return JSON.parse(storedPrefs)
  }
  return defaultPreferences
}

export function savePreferences(prefs: AppPreferences) {
  localStorage.setItem('1password-preferences', JSON.stringify(prefs))
}

// Initialize with default preferences if none exist
if (!localStorage.getItem('1password-preferences')) {
  savePreferences(defaultPreferences)
}

const preferences = getPreferences()

export class ExtensionError extends Error {
  public title: string
  constructor(title: string, message?: string) {
    if (!message) message = title
    super(message)
    this.title = title
  }
}

export class NotFoundError extends ExtensionError {}
export class CommandLineMissingError extends ExtensionError {}
export class ZshMissingError extends ExtensionError {}
export class ConnectionError extends ExtensionError {}

export function getCliPath() {
  const cliPath = window.$onePassword.getCliPath([
    preferences.cliPath,
    '/usr/local/bin/op',
    '/opt/homebrew/bin/op',
  ])

  if (!cliPath) {
    throw new CommandLineMissingError(
      '1Password CLI is not found. Please set the path in the extension preferences.',
    )
  }
  return cliPath
}

export const ZSH_PATH = window.$onePassword.getCliPath([preferences.zshPath, '/bin/zsh'])

export const errorRegex = new RegExp(/\[\w+\]\s+\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s+(.*)$/m)

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char: string) => char.toUpperCase())
}

export function hrefToOpenInBrowser(item: Item): string | undefined {
  if (item.category === 'LOGIN') {
    return item.urls?.find((url) => url.primary)?.href
  } else {
    return undefined
  }
}

export function actionsForItem(item: Item): ActionID[] {
  // all actions in the default order
  const defaultActions: ActionID[] = [
    'open-in-1password',
    'open-in-browser',
    'copy-username',
    'copy-password',
    'copy-one-time-password',
    'share-item',
    'switch-account',
  ]
  // prioritize primary and secondary actions, then append the rest and remove duplicates
  const deduplicatedActions = [
    ...new Set<ActionID>([
      preferences.primaryAction,
      preferences.secondaryAction,
      ...defaultActions,
    ]),
  ]

  switch (item.category) {
    case 'LOGIN':
      return deduplicatedActions
    case 'PASSWORD':
      return deduplicatedActions.filter((action) => action !== 'copy-username')
    default:
      return ['open-in-1password']
  }
}

export function op(args: string[]) {
  const cliPath = getCliPath()
  if (cliPath) {
    const result = window.$onePassword.executeOp(cliPath, args)
    if (result.success) {
      return result.data
    } else {
      throw new Error(result.error)
    }
  }
  throw Error('1Password CLI is not found!')
}

export function handleErrors(stderr: string) {
  if (stderr.includes('no such host')) {
    throw new ConnectionError('No connection to 1Password.', 'Verify Your Internet Connection.')
  } else if (stderr.includes('could not get item') || stderr.includes("isn't an item")) {
    throw new NotFoundError('Item not found on 1Password.', 'Check it on your 1Password app.')
  } else if (stderr.includes('ENOENT') || stderr.includes('file') || stderr.includes('enoent')) {
    throw new CommandLineMissingError('1Password CLI not found.')
  } else if (stderr.includes('does not have a field')) {
    throw new ExtensionError(
      `Item does not contain the field ${stderr.split('does not have a field ')[1].trim()}.`,
    )
  } else {
    throw new ExtensionError(stderr)
  }
}

export function checkZsh() {
  return !!ZSH_PATH
}

export function signIn(account?: string) {
  const cliPath = getCliPath()
  const result = window.$onePassword.signIn(cliPath, account, ZSH_PATH)
  if (result.success) {
    return result.data
  } else {
    throw new Error(result.error)
  }
}

export function getSignInStatus() {
  try {
    const cliPath = getCliPath()
    return window.$onePassword.checkSignInStatus(cliPath)
  } catch (stderr) {
    console.log(`[LOG] → getSignInStatus → stderr`, stderr)
    return false
  }
}

export function getCategoryIcon(category: CategoryName): string {
  switch (category) {
    case 'API_CREDENTIAL':
      return 'code'
    case 'CREDIT_CARD':
      return 'credit-card'
    case 'CRYPTO_WALLET':
      return 'bitcoin'
    case 'BANK_ACCOUNT':
    case 'CUSTOM':
      return 'wallet'
    case 'DATABASE':
      return 'database'
    case 'DOCUMENT':
      return 'file-text'
    case 'DRIVER_LICENSE':
      return 'car'
    case 'EMAIL_ACCOUNT':
      return 'mail'
    case 'IDENTITY':
      return 'user'
    case 'LOGIN':
      return 'key'
    case 'MEDICAL_RECORD':
      return 'activity'
    case 'MEMBERSHIP':
      return 'star'
    case 'OUTDOOR_LICENSE':
      return 'tree'
    case 'PASSPORT':
      return 'globe'
    case 'PASSWORD':
      return 'lock'
    case 'REWARD_PROGRAM':
      return 'gift'
    case 'SECURE_NOTE':
      return 'file'
    case 'SOCIAL_SECURITY_NUMBER':
      return 'shield'
    case 'SOFTWARE_LICENSE':
      return 'award'
    case 'SSH_KEY':
      return 'terminal'
    case 'WIRELESS_ROUTER':
      return 'wifi'
    default:
      return 'file'
  }
}
