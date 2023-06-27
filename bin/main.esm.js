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
const setEnv = (envName, outputPath) => {
    const filePath = `./env/${envName}`;
    if (!envName) {
        console.log(chalk.red('[error] 请输入环境名称, 如 development/production'));
        return;
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

const setVersion = (version) => {
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
    console.log(chalk.green('Android版本号修改成功(versionName:' + version, 'versionCode: ' + versionCode + ')'));
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
                    console.log(chalk.green(`[success] 版本号: ${version}, 文件大小: ${res}MB`));
                });
            }
        });
        child_process.exec("open ./android/app/build/outputs/apk/release/");
    }
    else {
        console.log(chalk.red("[error] 版本号读取出错,请核对"));
    }
};

const createImageType = (path = './src/assets') => {
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

// envVersion，表示传入的参数可能是版本号，也可能是环境名
const tools = ["version", "env", "open", "createImageType"];
(function () {
    // params: 第二个参：版本号 / 环境名称 / 图片路径
    const [toolType, params, outputPath] = process.argv.splice(2);
    if (!toolType || !tools.includes(toolType)) {
        console.log(`请输入以下方法:
version: 设置安卓版本号(e.g: apptool version 1.23.010101)
env: 设置当前环境参数(e.g: apptool env production)
open: 打开安卓打包文件夹
createImageType: 给图片添加ts类型, 可指定图片所在路径`);
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
