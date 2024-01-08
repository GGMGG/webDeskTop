// 初始化导入
// fs导入
import { existsSync, readFile, writeFile } from "fs";

/**
 * 文件工具类
 */
class fileUtil {
  /**
   * 文件工具类
   */
  constructor() {}

  /**
   * 判断给定的路径是否存在
   * @param {string} path
   * @returns
   */
  checkPathExists(path = "") {
    return new Promise((resolve, reject) => {
      if (!path || !existsSync(path)) {
        reject("路径不存在！");
      } else {
        resolve("路径存在！");
      }
    });
  }

  /**
   * 读取文件数据
   * @param {string} path
   * @returns
   */
  getDataFromFile(path = "") {
    return new Promise((resolve, reject) => {
      readFile(path, { flag: "r", encoding: "utf-8" }, (err, data) => {
        if (err) {
          reject("读取失败" + err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * 更新数据文件
   * @param {string} path
   * @param {object} obj
   * @returns
   */
  updateDataFile(path = "", obj = {}) {
    return new Promise((resolve, reject) => {
      writeFile(path, JSON.stringify(obj), (err) => {
        if (err) {
          reject("更新失败" + err);
        } else {
          resolve(obj);
        }
      });
    });
  }
}

export { fileUtil };
