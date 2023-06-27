import fs from 'fs'

const createImageType = (path = './src/assets') => {
  console.log(123)
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
  fs.writeFileSync('./src/assets/Images.ts', string);
}

export default createImageType

