import fs from "fs";
import chalk from "chalk";

const setVersion = (params: any) => {
  const version = params.version;
  if(!version || version.length !== 11){
    console.log(chalk.red('请输入正确的版本号, 如 x.xx.xxxxxx'))
    return
  }
  
  let versionCode = version.replace(/1\./, '20.')
  versionCode = versionCode.replace(/\./g, '');
  
  let androidFile = fs.readFileSync('./android/app/build.gradle', {encoding: 'utf8'});
  androidFile = androidFile.replace(/versionCode \d+/, `versionCode ${versionCode}`);
  androidFile = androidFile.replace(/versionName \".+\"/, `versionName "${version}"`);
  
  fs.writeFileSync('./android/app/build.gradle', androidFile);
  
  console.log(chalk.green('[success] Android版本号修改成功(versionName:' + version, 'versionCode: ' + versionCode + ')'))
}

export default setVersion





