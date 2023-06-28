#! /usr/bin/env node

import setEnv from "./setEnv";
import setVersion from "./setVersion";
import openFolder from "./openFolder";
import createImageType from "./createImageType";
import chalk from "chalk";

const tools = [
  { name: "version", fun: setVersion },
  { name: "env", fun: setEnv },
  { name: "openFolder", fun: openFolder },
  { name: "createImageType", fun: createImageType },
];

const showDetail = () => {
  console.log(`请输入以下方法:
version:         设置安卓版本号(e.g: apptool version:1.23.010101);
env:             设置当前环境参数(e.g: apptool env:production);
openFolder:      打开安卓打包文件夹,同时会把安装包命名为新的版本号;
createImageType: 给图片添加ts类型, 可指定图片所在路径;(e.g: createIMageType path:./src/assets)`
  );
};

(function () {
  const args = process.argv.splice(2);
  const params: any = {};
  if (args[0] === "-h") {
    showDetail();
    return;
  }
  args.forEach((param: string) => {
    const [key, value] = param.split(":");
    params[key] = value || true;
  });
  let isValiad = false;
  console.log(params);
  for (let i = 0; i < tools.length; i++) {
    if (params[tools[i].name]) {
      isValiad = true;
      tools[i].fun(params);
      break;
    }
  }
  if (!isValiad) {
    console.log(chalk.red(`[error] 命令不正确 ${args}`))
    showDetail();
  }
})();
