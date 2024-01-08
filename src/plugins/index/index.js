// 组件初始化引入
layui.use(["jquery", "layer", "form"], function () {
  $ = layui.jquery;
  layer = layui.layer;
  form = layui.form;

  // 初始化
  init();

  // 保存按钮监听
  form.on("submit(form-save)", function (data) {
    saveForm(data.field);
    return false;
  });

  // 重置按钮
  $("#resetBtn").click(() => {
    init();
    return false;
  });

  // 重启按钮
  $("#relaunchBtn").click(() => {
    relaunch();
    return false;
  });

  // 打开web窗口按钮
  $("#openWebWindowsBtn").click(() => {
    openWebWindows();
    return false;
  });
});
