// 工具类导入
import { fileUtil } from "./fileUtil.js";
import { commonUtil } from "./commonUtil.js";

/**
 * 数据操作工具类
 */
class dataUtil {
  /**
   * 文件工具类
   */
  __fileUtil = new fileUtil();

  /**
   * 通用工具类
   */
  __commonUtil = new commonUtil();

  /**
   * 数据操作工具类
   */
  constructor() {}

  /**
   * 根据文件名称读取数据
   * @param {string} fileName
   * @param {string} filePath
   * @param {string} fileName
   */
  getDataByFileName(dirName = "", filePath = "", fileName = "") {
    return new Promise((resolve, reject) => {
      // 读取配置文件数据
      const absoultPath = this.__commonUtil.replaceFilePath(`${dirName}${filePath}${fileName}`);
      this.__fileUtil
        .getDataFromFile(absoultPath)
        .then((res) => {
          if (res) {
            resolve(res);
          } else {
            reject("文件有误，请检查文件！");
          }
        })
        .catch((err) => {
          reject("读取文件失败！" + err);
        });
    });
  }

  /**
   * 根据文件名称更新数据
   * @param {string} fileName
   * @param {string} filePath
   * @param {string} fileName
   * @param {object} data
   */
  updateDataByFileName(dirName = "", filePath = "", fileName = "", data = {}) {
    return new Promise((resolve, reject) => {
      // 配置文件路径
      const absoultPath = this.__commonUtil.replaceFilePath(`${dirName}${filePath}${fileName}`);
      this.__fileUtil
        .updateDataFile(absoultPath, data)
        .then((res) => {
          if (res) {
            resolve(res);
          } else {
            reject("文件有误，请检查文件！");
          }
        })
        .catch((err) => {
          reject("更新文件失败！" + err);
        });
    });
  }
}

export { dataUtil };
