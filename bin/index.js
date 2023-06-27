#! /usr/bin/env node

import fs from "fs";
import chalk from "chalk";
import getParams from "./util.js";

const DEFAULT_PATH = "./src/config/index.ts";

const [envName, outputPath] = process.argv.splice(2);
const filePath = `./env/${envName}`;

const writeFile = () => {

  if(!envName){
    console.log(chalk.redBright('请输入环境名称, 如 development / production'));
    return
  }

  if (outputPath) {
    const existPath = fs.existsSync(outputPath);
    if (!existPath) {
      console.log(chalk.redBright(`${outputPath}, 该输出目录文件不存在`));
      return;
    }
  }
  const existEnvFile = fs.existsSync(filePath);
  if (!existEnvFile) {
    console.log(chalk.redBright(`${filePath}, 该配置文件不存在`));
    return;
  }
  const file = fs.readFileSync(filePath, "utf-8");
  const content = `${getParams(file)}`;
  fs.writeFileSync(outputPath || DEFAULT_PATH, content);
  console.log(chalk.greenBright(`已将接口地址设置为: ${envName}`));
  console.log(chalk.greenBright("如果是APP打包,请注意 iOS的环境!!!"));
};

writeFile();
