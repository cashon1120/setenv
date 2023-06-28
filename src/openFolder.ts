import fs from "fs";
import chalk from "chalk";
import child_process from "child_process";

const openFolder = async () => {

  const exist = fs.existsSync('./android/app/')
  if(!exist){
    console.log(chalk.red("[error] 没有android文件夹"));
    return
  }
  let androidFile = fs.readFileSync("./android/app/build.gradle", {
    encoding: "utf8",
  });
  const reg = /versionName \".+\"/;
  const getSize = async (filepath: string) => {
    const info = await fs.promises.stat(filepath);
    const size = info.size;
    return Math.ceil(size / 1024 / 1024);
  };

  let version: any = androidFile.match(reg);
  if (version) {
    version = version[0].split(" ")[1].replace(/\"/g, "");
    const filePath = "./android/app/build/outputs/apk/release/";
    fs.rename(
      `${filePath}app-arm64-v8a-release.apk`,
      `${filePath}${version}.apk`,
      (err?: any) => {
        if (err) {
          console.log(chalk.red("[error] 重命名文件出错"));
        } else {
          getSize(`${filePath}${version}.apk`).then((res) => {
            console.log(
              chalk.green(`[success] 包目录已打开, 版本号: ${version}, 文件大小: ${res}MB`)
            );
          });
        }
      }
    );
    child_process.exec("open ./android/app/build/outputs/apk/release/");
  } else {
    console.log(chalk.red("[error] 版本号读取出错,请核对"));
  }
};
export default openFolder;
