# 1Password uTools 插件

这是一个基于 uTools 平台的 1Password 密码管理工具插件，依赖 1Password CLI，参考了 1Password Raycast 插件的功能实现。

## 功能

- **密码项目浏览**：查看所有 1Password 中存储的密码项目
- **保险库管理**：按保险库分类查看密码项目
- **密码生成**：使用 1Password 生成安全的随机密码

## 前提条件

- 已安装 1Password 桌面应用
- 已安装 1Password CLI 命令行工具
- 已安装 uTools 平台

## 安装

1. 从 uTools 插件市场安装本插件
2. 确保 1Password CLI 已正确安装并可在终端中使用

## 使用方法

- 在 uTools 中输入 `1Password` 或 `密码` 来查看所有密码项目
- 在 uTools 中输入 `1Password保险库` 或 `保险库` 来查看所有保险库
- 在 uTools 中输入 `生成密码` 或 `随机密码` 来生成新的随机密码

## 源码

> [https://github.com/MrLeo/1Password-uTools.git](https://github.com/MrLeo/1Password-uTools.git "https://github.com/MrLeo/1Password-uTools.git")

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式运行
pnpm dev

# 构建插件
pnpm build
```

## 注意事项

- 首次使用时需要进行 1Password 账户认证
- 本插件需要访问 1Password CLI 来获取密码数据
- 所有操作都在本地完成，不会将您的密码数据发送到任何第三方服务器

## 许可证

MIT
