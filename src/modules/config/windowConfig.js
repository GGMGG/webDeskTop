// node path
import { join } from "path";
// 工具类导入
import { commonUtil } from "../utils/commonUtil.js";

/**
 * 窗体配置类
 */
class windowConfig {
  /**
   * 通用工具类
   */
  __commonUtil = new commonUtil();

  /**
   * 窗体配置
   */
  __configObj = {
    // 设置窗体宽度
    settingWidth: 600,
    // 设置窗体高度
    settingHeight: 600,
    // 默认窗体宽度
    defaultWidth: 1366,
    // 默认窗体高度
    defaultHeight: 760,
    // 白色
    whiteColor: "#FFFFFF",
    // 设置页面路径
    settingUrl: "src/views/index.html",
    // 应用图标路径
    icon: "assets/icon/favicon.ico",
    // 预加载脚本路径
    preloadJsUrl: "",
  };

  /**
   * 窗体配置类
   */
  constructor() {}

  /**
   * 获取窗体配置数据
   * @param {string} dirName
   * @returns
   */
  getWindowConfig(dirName = "") {
    return {
      ...this.__configObj,
      preloadJsUrl: join(dirName, "/modules/preload/preload.js"),
    };
  }
}

export { windowConfig };
