const fs = require('node:fs')
const path = require('node:path')
const child_process = require('node:child_process')
const { execFileSync, execSync } = require('node:child_process')

/**
 * 通过 window 对象向渲染进程注入 nodejs 能力
 */
window.$node = {
  fs,
  path,
  child_process,
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
      const stdout = execFileSync(cliPath, args, { maxBuffer: 4096 * 1024, ...options })
      return { success: true, data: stdout.toString() }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 执行 shell 命令
  executeCommand(command, options = {}) {
    try {
      const result = execSync(command, options)
      return { success: true, data: result.toString() }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 登录状态检查
  checkSignInStatus(cliPath) {
    try {
      execSync(`${cliPath} whoami`)
      return true
    } catch (error) {
      return false
    }
  },

  // 登录
  signIn(cliPath, account, shellPath) {
    try {
      const result = execSync(`${cliPath} signin ${account || ''}`, { shell: shellPath })
      return { success: true, data: result.toString() }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取密码列表
  getPasswords(cliPath, flags = []) {
    try {
      const result = execFileSync(cliPath, ['items', 'list', '--long', ...flags, '--format=json'], {
        encoding: 'utf-8',
      })
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取保险库列表
  getVaults(cliPath) {
    try {
      const result = execFileSync(cliPath, ['vault', 'list', '--format=json'], {
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
      const result = execFileSync(cliPath, ['item', 'template', 'list', '--format=json'], {
        encoding: 'utf-8',
      })
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取当前账户信息
  getAccount(cliPath) {
    try {
      const result = execFileSync(cliPath, ['whoami', '--format=json'], { encoding: 'utf-8' })
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },

  // 获取账户列表
  getAccounts(cliPath) {
    try {
      const result = execFileSync(cliPath, ['account', 'list', '--format=json'], {
        encoding: 'utf-8',
      })
      return { success: true, data: JSON.parse(result) }
    } catch (error) {
      return { success: false, error: error.message || String(error) }
    }
  },
}
