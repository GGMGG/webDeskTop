/**
 * 快捷键配置类
 */
class shortCutConfig {
  /**
   * 默认快捷键
   */
  __defaultShortCut = {
    openSetting: "Control+F1",
    exitFullScreen: "ESC",
    reload: "F5",
    reloadIgnoringCache: "Control+F5",
    devTool: "Control+F12",
  };

  /**
   * 快捷键配置类
   */
  constructor() {}

  /**
   * 获取默认快捷键
   */
  getDefaultShortCut() {
    return {
      ...this.__defaultShortCut,
    };
  }
}

export { shortCutConfig };
