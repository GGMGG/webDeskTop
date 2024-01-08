// 初始化导入
import { app, BrowserWindow, BrowserView, screen, ipcMain, globalShortcut } from "electron";
// 引入工具类
import { commonUtil } from "./commonUtil.js";
import { dataUtil } from "./dataUtil.js";
// 配置类导入
import { windowConfig } from "../config/windowConfig.js";
import { projectConfig } from "../config/projectConfig.js";
import { shortCutConfig } from "../config/shortCutConfig.js";

/**
 * 窗体工具类
 */
class windowUtil {
  /**
   * 窗体配置数据
   */
  __windowConfig = {};

  /**
   * 项目配置
   */
  __configObj = {};

  /**
   * 工程路径
   */
  __dirname = "";

  /**
   * 通用工具类
   */
  __commonUtil = new commonUtil();

  /**
   * 数据操作工具类
   */
  __dataUtil = new dataUtil();

  /**
   * 窗体配置类
   */
  __windowConfigUtil = new windowConfig();

  /**
   * 配置数据类
   */
  __projectConfigUtil = new projectConfig();

  /**
   * 快捷键配置类
   */
  __shortCutConfig = new shortCutConfig();

  /**
   * 设置窗体对象
   */
  settingWindows = null;

  /**
   * 浏览器窗体对象
   */
  browserWindows = null;

  /**
   * web嵌入窗体对象
   */
  browserView = null;

  /**
   * 窗体工具类
   * @param {string} dirName
   */
  constructor(dirName = "") {
    // 配置初始化
    this.__dirname = dirName;
    this.__windowConfig = this.__windowConfigUtil.getWindowConfig(dirName);
    this.__configObj = this.__projectConfigUtil.getProjectConfig();
  }

  /**
   * 创建主窗体
   */
  async createMainView() {
    const configData = await this.__getConfigData();
    configData && this.__createMainWindows(configData);
  }

  /**
   * 创建主窗体
   * @param {object} configData
   */
  __createMainWindows(configData = {}) {
    const {
      setting: { skipSetting },
    } = configData;
    if (skipSetting !== "true") {
      this.__createSettingWindows(configData);
      return;
    }

    this.__createBrowserWindows(configData);
  }

  /**
   * 创建设置窗体
   * @param {object} configData
   */
  __createSettingWindows(configData = {}) {
    const { shortCut } = configData;
    // 创建设置窗体
    this.settingWindows = this.__createBrowserWindow("setting");
    // 载入页面
    this.settingWindows.loadFile(this.__windowConfig.settingUrl);
    // 监听窗体准备状态
    this.settingWindows.once("ready-to-show", () => {
      // 发送进程间通信（初始化）
      this.__setIpcSendInit(configData);
      // 注册进程间通信
      this.__setIpcOn(configData);
    });
    // 通用监听
    this.__listenWindows(this.settingWindows, shortCut);
  }

  /**
   * 创建浏览器窗体
   * @param {object} configData
   */
  __createBrowserWindows(configData = {}) {
    const {
      baseInfo: { title, url },
      setting: { autoFullScreen },
      shortCut,
    } = configData;
    // 创建浏览器窗体
    this.browserWindows = this.__createBrowserWindow("browser", title);
    // 创建web页面嵌入窗体
    this.browserView = new BrowserView();
    this.browserWindows.setBrowserView(this.browserView);
    // 设置初始大小
    // 获取browserView初始大小
    const { browserViewBoundsWidth, browserViewBoundsHeight } = this.__checkIsAutoFullScreen(autoFullScreen);
    this.browserView.setBounds({
      x: 0,
      y: 0,
      width: browserViewBoundsWidth,
      height: browserViewBoundsHeight,
    });
    // 设置自适应
    this.browserView.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });
    // 载入web地址
    this.browserView.webContents.loadURL(url);
    // 监听web dom渲染完成
    this.browserView.webContents.once("dom-ready", () => {
      // 隐藏setting窗口
      this.settingWindows && !this.settingWindows.isDestroyed() && this.settingWindows.hide();
      // 设置标题
      this.browserWindows.setTitle(title);
    });
    // 监听当前窗体关闭
    this.browserWindows.on("close", () => {
      this.settingWindows && !this.settingWindows.isDestroyed() && !this.settingWindows.isVisible() && this.settingWindows.close();
    });
    // 通用监听
    this.__listenWindows(this.browserWindows, shortCut);
  }

  /**
   * 创建browserwindow
   * @param {string} type
   * @param {string} title
   */
  __createBrowserWindow(type = "setting", title = "") {
    return new BrowserWindow({
      title: type === "setting" ? "系统设置" : title,
      show: true,
      resizable: true,
      autoHideMenuBar: true,
      titleBarOverlay: {
        color: this.__windowConfig.whiteColor,
        symbolColor: this.__windowConfig.whiteColor,
      },
      width: type === "setting" ? this.__windowConfig.settingWidth : this.__windowConfig.defaultWidth,
      height: type === "setting" ? this.__windowConfig.settingHeight : this.__windowConfig.defaultHeight + 8,
      minWidth: type === "setting" ? this.__windowConfig.settingWidth : this.__windowConfig.defaultWidth,
      minHeight: type === "setting" ? this.__windowConfig.settingHeight : this.__windowConfig.defaultHeight + 8,
      backgroundColor: this.__windowConfig.whiteColor,
      icon: this.__windowConfig.icon,
      webPreferences: {
        preload: this.__windowConfig.preloadJsUrl,
        webSecurity: false, //禁用同源策略
        nodeIntegration: false, // 是否启用Node integration.
        webviewTag: false, // 是否启用webview
      },
    });
  }

  /**
   * 窗体通用监听
   * @param {object} windows
   * @param {object} shortCut
   */
  __listenWindows(windows = {}, shortCut = {}) {
    // 监听窗体奔溃
    windows.on("unresponsive", () => {
      this.__commonUtil.doCatchErr("错误", "页面奔溃了，即将重新创建窗体！", this.settingWindows, this.browserWindows);
    });
    // 监听窗体获得焦点
    windows.on("focus", () => {
      // 注册普通快捷键
      this.__registryNormal(windows, shortCut);
    });
    // 监听窗体失去焦点
    windows.on("blur", () => {
      globalShortcut.unregisterAll();
    });
    // 监听当前窗体关闭
    windows.on("close", () => {
      globalShortcut.unregisterAll();
    });
  }

  /**
   * 判断是否默认全屏，来获取browserView初始大小
   * @param {string} autoFullScreen
   */
  __checkIsAutoFullScreen(autoFullScreen = "false") {
    // browserView初始大小
    let browserViewBoundsWidth = this.__windowConfig.defaultWidth - 10;
    let browserViewBoundsHeight = this.__windowConfig.defaultHeight - 2;
    if (autoFullScreen !== "false") {
      this.browserWindows.setFullScreen(true);
      const { width, height } = screen.getPrimaryDisplay().bounds;
      browserViewBoundsWidth = width - 10;
      browserViewBoundsHeight = height - 2;
    }

    return {
      browserViewBoundsWidth,
      browserViewBoundsHeight,
    };
  }

  /**
   * 发送进程间通信（初始化）
   * @param {object} configData
   */
  __setIpcSendInit(configData = {}) {}

  /**
   * 进程间通信（主进程到渲染器）
   * @param {object} param
   */
  __setIpcSend(param = {}) {
    const { method, result } = param;
    if (method) {
      this.settingWindows.webContents.send(method, result);
    }
  }

  /**
   * 注册进程间通信（渲染器到主进程）
   * @param {object} configData
   */
  __setIpcOn(configData = {}) {
    // 获取config数据
    ipcMain.on("get-config-data", (event, param) => {
      this.__setIpcSend({ method: "set-config-data", result: { success: true, result: JSON.stringify(configData) } });
    });

    // 保存config数据
    ipcMain.on("save-config-data", (event, param) => {
      this.__saveConfigData(param);
    });

    // 重启应用
    ipcMain.on("relaunch", (event, param) => {
      this.settingWindows && !this.settingWindows.isDestroyed() && this.settingWindows.close();
      this.browserWindows && !this.browserWindows.isDestroyed() && this.browserWindows.close();
      app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) });
      app.exit(0);
    });

    // 打开web窗口
    ipcMain.on("open-web-windows", (event, param) => {
      this.__openWebWindows();
    });
  }

  /**
   * 数据文件读取
   */
  __getConfigData() {
    return this.__dataUtil
      .getDataByFileName(this.__commonUtil.replaceProjectPath(this.__dirname), this.__configObj.dataPath, this.__configObj.dataFile)
      .then((res) => {
        return JSON.parse(res);
      })
      .catch((err) => {
        this.__commonUtil.doCatchErr("读取数据文件失败", err, this.settingWindows, this.browserWindows);
        return null;
      });
  }

  /**
   * 保存config数据
   * @param {object} param
   */
  __saveConfigData(param = {}) {
    const configData = {
      baseInfo: {
        title: param.title,
        url: param.url,
      },
      setting: {
        autoFullScreen: param.autoFullScreen,
        skipSetting: param.skipSetting,
      },
      shortCut: {
        openSetting: param.openSetting,
        exitFullScreen: param.exitFullScreen,
        reload: param.reload,
        reloadIgnoringCache: param.reloadIgnoringCache,
        devTool: param.devTool,
      },
    };

    this.__dataUtil
      .updateDataByFileName(this.__commonUtil.replaceProjectPath(this.__dirname), this.__configObj.dataPath, this.__configObj.dataFile, configData)
      .then((res) => {
        this.__setIpcSend({ method: "show-msg", result: { msg: "保存成功！部分配置在重启后生效！", type: 6 } });
      })
      .catch((err) => {
        this.__setIpcSend({ method: "show-msg", result: { msg: `保存数据文件失败(${err})`, type: 5 } });
      });
  }

  /**
   * 打开web窗口
   */
  async __openWebWindows() {
    this.browserWindows && !this.browserWindows.isDestroyed() && this.browserWindows.close();
    const configData = await this.__getConfigData();
    configData && this.__createBrowserWindows(configData);
  }

  /**
   * 打开设置窗口方法
   */
  async __openSettingFn() {
    if (this.settingWindows && !this.settingWindows.isDestroyed()) {
      this.settingWindows.show();
    } else {
      const configData = await this.__getConfigData();
      configData && this.__createSettingWindows(configData);
    }
  }

  /**
   * 快捷键注册
   * @param {object} windowsName
   * @param {object} shortCut
   */
  __registryNormal(windowsName = {}, shortCut = this.__shortCutConfig.getDefaultShortCut()) {
    if (!windowsName || windowsName.isDestroyed()) {
      return;
    }

    // 销毁所有快捷键
    globalShortcut.unregisterAll();
    // 开始注册快捷键
    const { openSetting, exitFullScreen, reload, reloadIgnoringCache, devTool } = shortCut;

    // 打开设置窗口
    openSetting &&
      globalShortcut.register(`${openSetting}`, () => {
        this.__openSettingFn();
      });

    // 退出全屏
    exitFullScreen &&
      globalShortcut.register(`${exitFullScreen}`, () => {
        windowsName.setFullScreen(false);
      });

    // 刷新当前页面
    reload &&
      globalShortcut.register(`${reload}`, () => {
        windowsName.webContents.reload();
      });

    // 强制刷新页面
    reloadIgnoringCache &&
      globalShortcut.register(`${reloadIgnoringCache}`, () => {
        windowsName.webContents.reloadIgnoringCache();
      });

    // 注册开发者工具
    devTool &&
      globalShortcut.register(`${devTool}`, () => {
        windowsName.webContents.openDevTools();
      });
  }
}

export { windowUtil };
