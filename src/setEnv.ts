import fs from "fs";
import chalk from "chalk";
import getParams from "./util";
const DEFAULT_OUTPUT_PATH = "./src/config/envVariable.ts";

const setEnv = (envName: string, outputPath?: string) => {
    const filePath = `./env/${envName}`;
    if(!envName){
      console.log(chalk.red('[error] 请输入环境名称, 如 development/production'));
      return
    }
  
    if (outputPath) {
      const existPath = fs.existsSync(outputPath);
      if (!existPath) {
        console.log(chalk.red(`[error] ${outputPath}, 该输出目录文件不存在`));
        return;
      }
    }
    const existEnvFile = fs.existsSync(filePath);
    if (!existEnvFile) {
      console.log(chalk.red(`[error] ${envName}, 该输配置文件不存在`));
      return;
    }
    const file = fs.readFileSync(filePath, "utf-8");
    const content = `${getParams(file)}`;
    fs.writeFileSync(outputPath || DEFAULT_OUTPUT_PATH, content);
    console.log(chalk.green(`[success] 已将环境设置为: ${envName}`));
    console.log(chalk.yellow("[warning] 如果是APP打包,请注意iOS的环境!!!"));
  };

  export default setEnv