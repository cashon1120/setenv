const getParams = (file: string) => {
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

export default getParams
