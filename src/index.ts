#! /usr/bin/env node

import setEnv from "./setEnv";
import setVersion from "./setVersion";
import openFolder from "./openFolder";
import createImageType from "./createImageType"
// envVersion，表示传入的参数可能是版本号，也可能是环境名

const tools = ["version", "env", "open", "createImageType"];

(function () {
  // params: 第二个参：版本号 / 环境名称 / 图片路径
  const [toolType, params, outputPath] = process.argv.splice(2);
  if (!toolType || !tools.includes(toolType)) {
    console.log(
      `请输入以下方法:
version: 设置安卓版本号(e.g: apptool version 1.23.010101)
env: 设置当前环境参数(e.g: apptool env production)
open: 打开安卓打包文件夹
createImageType: 给图片添加ts类型, 可指定图片所在路径`
    );
    return;
  }

  switch (toolType) {
    case "version":
      setVersion(params);
      break;
    case "env":
      setEnv(params, outputPath);
      break;
    case "open":
      openFolder();
      break;
    case "createImageType":
      createImageType(params);
      break;
  }
})();
