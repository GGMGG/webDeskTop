// 应用初始化
// 初始化全局变量
let $,
  layer,
  form = null;

// 配置信息
let configData = {};
// 加载框对象
let loadIndex = null;

// 主进程调用渲染进程方法
/**
 * 展示提示信息
 */
const showMsg = () => {
  window.electronAPI.showMsg((event, value) => {
    if (value && value.msg && value.type) {
      if (value.type === -1) {
        layer.msg(value.msg);
      } else {
        layer.msg(value.msg, { icon: value.type }, function () {});
      }
    } else {
      layer.msg("操作失败！", { icon: 5 }, function () {});
    }
  });
};

/**
 * 设置config数据
 */
const setConfigData = () => {
  window.electronAPI.setConfigData((event, value) => {
    if (value && value.success) {
      configData = JSON.parse(value.result);
    } else {
      layer.msg("初始化失败！请重启！", { icon: 5 }, function () {});
    }
  });
};

// 渲染进程调用主进程方法
/**
 * 获取config数据
 */
const getConfigData = () => {
  window.electronAPI.getConfigData();
};

/**
 * 保存配置数据
 */
const saveConfigData = (configData = {}) => {
  window.electronAPI.saveConfigData(configData);
};

/**
 * 重启应用
 */
const relaunch = () => {
  window.electronAPI.relaunch();
};

/**
 * 打开web窗口
 */
const openWebWindows = () => {
  window.electronAPI.openWebWindows();
};

// 应用方法
/**
 * 初始化
 */
const init = () => {
  // show loading
  loadIndex = layer.msg("加载中", {
    icon: 16,
    shade: 0.5,
  });

  // 获取config数据
  getConfigData();
  // 延迟设置form
  setTimeout(() => {
    initForm();
    // close loading
    layer.close(loadIndex);
  }, 1000);
};

/**
 * 表单初始化
 */
const initForm = () => {
  const { baseInfo } = configData;
  const { setting } = configData;
  const { shortCut } = configData;
  // 表单赋值
  form.val("configForm", {
    ...baseInfo,
    ...setting,
    ...shortCut,
  });
};

/**
 * 保存表单
 * @param {object} formData
 */
const saveForm = (formData = {}) => {
  if (!formData) {
    layer.msg("数据不完整！保存失败！", { icon: 5 }, function () {});
    return;
  }

  saveConfigData(formData);
};

// 注册主进程调用渲染进程方法
showMsg();
setConfigData();
