import fs from "fs";
import chalk from "chalk";
import getParams from "./util";
const DEFAULT_OUTPUT_PATH = "./src/config/envVariable.ts";

const setEnv = (params: any) => {
  const {env, outputPath = DEFAULT_OUTPUT_PATH, isBuild} = params
    const envFilePath = `./env/${env}`;
    if(!env){
      console.log(chalk.red('[error] 请输入环境名称, 如 development/production'));
      return
    }

    const existEnvFilePath = fs.existsSync(envFilePath);
    if (!existEnvFilePath) {
      console.log(chalk.red(`[error] ${env}, 该输配置文件不存在`));
      return;
    }
  
    const existOutputPath = fs.existsSync(outputPath);
    if (!existOutputPath) {
      console.log(chalk.red(`[error] ${outputPath}, 该输出目录文件不存在`));
      return;
    }

    const file = fs.readFileSync(envFilePath, "utf-8");
    const content = `${getParams(file)}`;
    fs.writeFileSync(outputPath, content);
    if(isBuild){
      console.log(chalk.green(`[success] 已将环境设置为: ${env}, 开始打包Android...`));
      console.log(chalk.yellow("[warning] 请注意iOS的环境,最好先打包Android再打包iOS!!!"));
    }else{
      console.log(chalk.green(`[success] 已将环境设置为: ${env}`));
    }
    
  };

  export default setEnv