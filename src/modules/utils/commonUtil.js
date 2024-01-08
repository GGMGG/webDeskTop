// 初始化导入
import { app } from "electron";
// 工具类导入
import { exceptionUtil } from "./exceptionUtil.js";

/**
 * 通用工具类
 */
class commonUtil {
  /**
   * 异常处理工具类
   */
  __exceptionUtil = new exceptionUtil();

  /**
   * 通用工具类
   */
  constructor() {}

  /**
   * 文件路径格式化
   * @param {string} filePath
   * @returns
   */
  replaceFilePath(filePath = "") {
    return filePath.replaceAll("/", "\\");
  }

  /**
   * 工程路径格式化
   * @param {string} projectPath
   * @returns
   */
  replaceProjectPath(projectPath = "") {
    return projectPath.replace("modules", "");
  }

  /**
   * 执行异常捕捉
   * @param {string} title
   * @param {string} msg
   */
  doCatchErr(title = "", msg = "", ...args) {
    this.__exceptionUtil
      .catchErr(title, msg, ...args)
      .then((res) => {
        app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) });
        app.exit(0);
      })
      .catch((err) => {
        console.log("doCatchErr-操作失败", err);
      });
  }
}

export { commonUtil };
