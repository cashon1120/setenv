import chalk from 'chalk';
import fs from 'fs'

const createImageType = (params: any) => {
  const {path} = params;
  const files = fs.readdirSync(path);
  let Images: any = {};
  let interfaceStr: any = {};
  const fileTypes = ['png', 'jpg', 'jpeg'];
  files.forEach(item => {
    const fileInfo = item.split('.');
    if (fileTypes.includes(fileInfo[1])) {
      const name = fileInfo[0];
      interfaceStr[name] = 'ImageSourcePropType';
      Images[name] = `require(./${item})`;
    }
  });
  if(Object.keys(Images).length === 0){
    console.log(chalk.yellow('[warning] 没有找到图片，请核对图片所在路径'))
    return
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
}

export default createImageType

