/// <reference types="vite/client" />

interface Services {
  /**
   * 读取文件内容
   * @param file 文件路径
   * @returns 文件内容（UTF-8编码）
   */
  readFile(file: string): string

  /**
   * 文本写入到下载目录
   * @param text 要写入的文本内容
   * @returns 写入的文件路径
   */
  writeTextFile(text: string): string

  /**
   * 图片写入到下载目录
   * @param base64Url 图片的base64 URL (data:image/xxx;base64,...)
   * @returns 写入的文件路径，如果base64Url格式不正确则返回undefined
   */
  writeImageFile(base64Url: string): string | undefined
}

interface Window {
  services: Services
  utools: {
    getPath(name: string): string
    // 可以根据需要添加更多utools API的类型定义
  }
}
