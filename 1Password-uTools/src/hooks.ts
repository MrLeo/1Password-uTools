import type { Ref } from 'vue'
import { ref } from 'vue'
import type { Category, Item, User, Vault } from './types'
import { getCliPath, handleErrors } from './utils'

// 定义 useOp 返回类型接口
interface UseOpReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  refresh: () => void
}

export function useOp<T>(args: string[], callback?: (data: T) => T): UseOpReturn<T> {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(true)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const cliPath = getCliPath()
      const result = window.onePassword.executeOp(cliPath, [...args, '--format=json'], {
        encoding: 'utf-8',
      })
      if (result.success) {
        const parsedData = result.data as unknown as T
        data.value = callback ? callback(parsedData) : parsedData
      } else {
        handleErrors(result.error || '')
        error.value = new Error(result.error)
      }
    } catch (err) {
      if (err instanceof Error) {
        handleErrors(err.message)
        error.value = err
      } else {
        error.value = new Error(String(err))
      }
    } finally {
      isLoading.value = false
    }
  }

  fetchData()

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  } as UseOpReturn<T>
}

export function usePasswords(flags: string[] = []) {
  const data = ref<Item[] | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(true)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const cliPath = getCliPath()
      const result = window.onePassword.getPasswords(cliPath, flags)
      if (result.success) {
        data.value = result.data.sort((a: Item, b: Item) => a.title.localeCompare(b.title))
      } else {
        handleErrors(result.error || '')
        error.value = new Error(result.error)
      }
    } catch (err) {
      if (err instanceof Error) {
        handleErrors(err.message)
        error.value = err
      } else {
        error.value = new Error(String(err))
      }
    } finally {
      isLoading.value = false
    }
  }

  fetchData()

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  } as UseOpReturn<Item[]>
}

export function useVaults() {
  const data = ref<Vault[] | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(true)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const cliPath = getCliPath()
      const result = window.onePassword.getVaults(cliPath)
      if (result.success) {
        data.value = result.data.sort((a: Vault, b: Vault) => a.name.localeCompare(b.name))
      } else {
        handleErrors(result.error || '')
        error.value = new Error(result.error)
      }
    } catch (err) {
      if (err instanceof Error) {
        handleErrors(err.message)
        error.value = err
      } else {
        error.value = new Error(String(err))
      }
    } finally {
      isLoading.value = false
    }
  }

  fetchData()

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  } as UseOpReturn<Vault[]>
}

export function useCategories() {
  const data = ref<Category[] | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(true)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const cliPath = getCliPath()
      const result = window.onePassword.getCategories(cliPath)
      if (result.success) {
        data.value = result.data.sort((a: Category, b: Category) => a.name.localeCompare(b.name))
      } else {
        handleErrors(result.error || '')
        error.value = new Error(result.error)
      }
    } catch (err) {
      if (err instanceof Error) {
        handleErrors(err.message)
        error.value = err
      } else {
        error.value = new Error(String(err))
      }
    } finally {
      isLoading.value = false
    }
  }

  fetchData()

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  } as UseOpReturn<Category[]>
}

export function useAccount() {
  const data = ref<User | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(true)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const cliPath = getCliPath()
      const result = window.onePassword.getAccount(cliPath)
      if (result.success) {
        data.value = result.data
      } else {
        handleErrors(result.error || '')
        error.value = new Error(result.error)
      }
    } catch (err) {
      if (err instanceof Error) {
        handleErrors(err.message)
        error.value = err
      } else {
        error.value = new Error(String(err))
      }
    } finally {
      isLoading.value = false
    }
  }

  fetchData()

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  } as UseOpReturn<User>
}

export function useAccounts(): {
  data: Ref<User[] | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  refresh: () => void
} {
  const data = ref<User[] | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(true)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const cliPath = getCliPath()
      const result = window.onePassword.getAccounts(cliPath)
      if (result.success) {
        data.value = result.data
      } else {
        handleErrors(result.error || '')
        error.value = new Error(result.error)
      }
    } catch (err) {
      if (err instanceof Error) {
        handleErrors(err.message)
        error.value = err
      } else {
        error.value = new Error(String(err))
      }
    } finally {
      isLoading.value = false
    }
  }

  fetchData()

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  }
}
