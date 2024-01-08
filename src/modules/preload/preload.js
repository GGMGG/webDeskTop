// 预加载脚本
// 初始化导入
const { contextBridge, ipcRenderer } = require("electron");

/**
 * 主进程通信渲染
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // 主进程=>渲染器
  // 展示提示信息
  showMsg: (callback) => ipcRenderer.on("show-msg", callback),
  // 设置config数据
  setConfigData: (callback) => ipcRenderer.on("set-config-data", callback),

  // 渲染器=>主进程
  // 获取config数据
  getConfigData: (param) => ipcRenderer.send("get-config-data", param),
  // 保存config数据
  saveConfigData: (param) => ipcRenderer.send("save-config-data", param),
  // 重启应用
  relaunch: (param) => ipcRenderer.send("relaunch", param),
  // 打开web窗口
  openWebWindows: (param) => ipcRenderer.send("open-web-windows", param),
});
