#!/usr/bin/env node
import fs from 'fs';
import chalk from 'chalk';
import child_process from 'child_process';

const getParams = (file) => {
    const keys = file.split('\n');
    let fileContent = '';
    keys.forEach((str, index) => {
        keys[index] = str.replace(/\s/g, '');
        if (keys[index].indexOf('=') > 0) {
            const [key, value] = keys[index].split('=');
            fileContent = fileContent + `export const ${key} = '${value}';\n`;
        }
    });
    return fileContent;
};

const DEFAULT_OUTPUT_PATH = "./src/config/envVariable.ts";
const setEnv = (params) => {
    const { env, outputPath = DEFAULT_OUTPUT_PATH, isBuild } = params;
    const envFilePath = `./env/${env}`;
    if (!env) {
        console.log(chalk.red('[error] 请输入环境名称, 如 development/production'));
        return;
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
    if (isBuild) {
        console.log(chalk.green(`[success] 已将环境设置为: ${env}, 开始打包Android...`));
        console.log(chalk.yellow("[warning] 请注意iOS的环境,最好先打包Android再打包iOS!!!"));
    }
    else {
        console.log(chalk.green(`[success] 已将环境设置为: ${env}`));
    }
};

const setVersion = (params) => {
    const version = params.version;
    if (!version || version.length !== 11) {
        console.log(chalk.red('请输入正确的版本号, 如 x.xx.xxxxxx'));
        return;
    }
    let versionCode = version.replace(/1\./, '20.');
    versionCode = versionCode.replace(/\./g, '');
    let androidFile = fs.readFileSync('./android/app/build.gradle', { encoding: 'utf8' });
    androidFile = androidFile.replace(/versionCode \d+/, `versionCode ${versionCode}`);
    androidFile = androidFile.replace(/versionName \".+\"/, `versionName "${version}"`);
    fs.writeFileSync('./android/app/build.gradle', androidFile);
    console.log(chalk.green('[success] Android版本号修改成功(versionName:' + version, 'versionCode: ' + versionCode + ')'));
};

const openFolder = async () => {
    const exist = fs.existsSync('./android/app/');
    if (!exist) {
        console.log(chalk.red("[error] 没有android文件夹"));
        return;
    }
    let androidFile = fs.readFileSync("./android/app/build.gradle", {
        encoding: "utf8",
    });
    const reg = /versionName \".+\"/;
    const getSize = async (filepath) => {
        const info = await fs.promises.stat(filepath);
        const size = info.size;
        return Math.ceil(size / 1024 / 1024);
    };
    let version = androidFile.match(reg);
    if (version) {
        version = version[0].split(" ")[1].replace(/\"/g, "");
        const filePath = "./android/app/build/outputs/apk/release/";
        fs.rename(`${filePath}app-arm64-v8a-release.apk`, `${filePath}${version}.apk`, (err) => {
            if (err) {
                console.log(chalk.red("[error] 重命名文件出错"));
            }
            else {
                getSize(`${filePath}${version}.apk`).then((res) => {
                    console.log(chalk.green(`[success] 包目录已打开, 版本号: ${version}, 文件大小: ${res}MB`));
                });
            }
        });
        child_process.exec("open ./android/app/build/outputs/apk/release/");
    }
    else {
        console.log(chalk.red("[error] 版本号读取出错,请核对"));
    }
};

const createImageType = (params) => {
    const { path } = params;
    const files = fs.readdirSync(path);
    let Images = {};
    let interfaceStr = {};
    const fileTypes = ['png', 'jpg', 'jpeg'];
    files.forEach(item => {
        const fileInfo = item.split('.');
        if (fileTypes.includes(fileInfo[1])) {
            const name = fileInfo[0];
            interfaceStr[name] = 'ImageSourcePropType';
            Images[name] = `require(./${item})`;
        }
    });
    if (Object.keys(Images).length === 0) {
        console.log(chalk.yellow('[warning] 没有找到图片，请核对图片所在路径'));
        return;
    }
    Images = JSON.stringify(Images, null, '\t');
    Images = Images.replace(/:\s"/g, ': ');
    Images = Images.replace(/\(/g, '("');
    Images = Images.replace(/\)"/g, '")');
    Images = Images.replace(/"/g, "'");
    interfaceStr = JSON.stringify(interfaceStr, null, '\t');
    interfaceStr = interfaceStr.replace(/:\s"/g, ': ');
    interfaceStr = interfaceStr.replace(/,/g, ';');
    interfaceStr = interfaceStr.replace(/"/g, '');
    const string = `import {ImageSourcePropType} from 'react-native';\nexport interface ImagesProps${interfaceStr}\nconst Images: ImagesProps = ${Images} \nexport default Images`;
    fs.writeFileSync(`${path}/Images.ts`, string);
};

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
createImageType: 给图片添加ts类型, 可指定图片所在路径;(e.g: createIMageType path:./src/assets)`);
};
(function () {
    const args = process.argv.splice(2);
    const params = {};
    if (args[0] === "-h") {
        showDetail();
        return;
    }
    args.forEach((param) => {
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
        console.log(chalk.red(`[error] 命令不正确 ${args}`));
        showDetail();
    }
})();
