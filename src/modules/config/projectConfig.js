/**
 * 配置数据类
 */
class projectConfig {
  /**
   * 配置数据
   */
  __configObj = {
    dataPath: "/assets/data/",
    dataFile: "config.json",
  };

  /**
   * 配置数据类
   */
  constructor() {}

  /**
   * 获取配置数据
   * @returns
   */
  getProjectConfig() {
    return {
      ...this.__configObj,
    };
  }
}

export { projectConfig };
