const fs = require('node:fs')
const path = require('node:path')
const child_process = require('node:child_process')

/** 通过 window 对象向渲染进程注入 nodejs 能力 */
window.$node = {
  fs,
  path,
  child_process,
}

/** 1Password CLI 相关服务 */
window.$1password = {
  /** 检查 1Password CLI 是否安装 */
  checkOPCLI() {
    try {
      child_process.execSync('op --version', { stdio: 'ignore' })
      return true
    } catch (error) {
      return false
    }
  },
  /** 获取 1Password 账户信息 */
  async getAccountInfo() {
    try {
      const result = child_process.execSync('op account list --format=json', { encoding: 'utf8' })
      return JSON.parse(result)
    } catch (error) {
      throw new Error(`无法获取 1Password 账户信息: ${error.message}`)
    }
  },
  /** 搜索密码条目 */
  async searchPasswords(query) {
    try {
      const result = child_process.execSync(`op item list --categories Login --format=json`, {
        encoding: 'utf8',
      })
      const items = JSON.parse(result)

      if (!query) return items

      return items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.url?.toLowerCase().includes(query.toLowerCase()),
      )
    } catch (error) {
      throw new Error(`搜索密码失败: ${error.message}`)
    }
  },
  /** 获取密码详情 */
  async getPasswordDetails(itemId) {
    try {
      const result = child_process.execSync(`op item get ${itemId} --reveal --format=json`, {
        encoding: 'utf8',
      })
      return JSON.parse(result)
    } catch (error) {
      throw new Error(`获取密码详情失败: ${error.message}`)
    }
  },
  /** 获取密码字段值 */
  async getFieldValue(itemId, fieldName) {
    try {
      const result = child_process.execSync(
        `op item get ${itemId} --fields ${fieldName} --reveal`,
        {
          encoding: 'utf8',
        },
      )
      return result.toString().trim()
    } catch (error) {
      throw new Error(`获取 ${fieldName} 失败: ${error.message}`)
    }
  },
}

/**
 * 1Password CLI 相关服务
 */
window.$onePassword = {
  // 检查文件路径是否存在
  checkPathExists(filePath) {
    return fs.existsSync(filePath)
  },

  // 获取 CLI 路径
  getCliPath(paths) {
    return paths.filter(Boolean).find((path) => (path ? fs.existsSync(path) : false))
  },

  // 执行 1Password CLI 命令
  executeOp(cliPath, args, options = {}) {
    try {
      const stdout = child_process.execFileSync(cliPath, args, {
        maxBuffer: 4096 * 1024,
        ...options,
      })
      return { success: true, data: stdout.toString() }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 执行 shell 命令
  executeCommand(command, options = {}) {
    try {
      const result = child_process.execSync(command, options)
      return { success: true, data: result.toString() }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 登录状态检查
  checkSignInStatus(cliPath) {
    try {
      child_process.execSync(`${cliPath} whoami`)
      return true
    } catch (error) {
      return false
    }
  },

  // 登录
  signIn(cliPath, account, shellPath) {
    try {
      const result = child_process.execSync(`${cliPath} signin ${account || ''}`, {
        shell: shellPath,
      })
      return { success: true, data: result.toString() }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取密码列表
  getPasswords(cliPath, flags = []) {
    try {
      const result = child_process.execFileSync(
        cliPath,
        ['items', 'list', '--long', ...flags, '--format=json'],
        {
          encoding: 'utf-8',
        },
      )
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取保险库列表
  getVaults(cliPath) {
    try {
      const result = child_process.execFileSync(cliPath, ['vault', 'list', '--format=json'], {
        encoding: 'utf-8',
      })
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取分类列表
  getCategories(cliPath) {
    try {
      const result = child_process.execFileSync(
        cliPath,
        ['item', 'template', 'list', '--format=json'],
        {
          encoding: 'utf-8',
        },
      )
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取当前账户信息
  getAccount(cliPath) {
    try {
      const result = child_process.execFileSync(cliPath, ['whoami', '--format=json'], {
        encoding: 'utf-8',
      })
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取账户列表
  getAccounts(cliPath) {
    try {
      const result = child_process.execFileSync(cliPath, ['account', 'list', '--format=json'], {
        encoding: 'utf-8',
      })
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },
}
