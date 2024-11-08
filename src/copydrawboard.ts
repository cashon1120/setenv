import fs from "fs";
import chalk from "chalk";

const files = [
  "drawboard.min.js",
  "drawboard.min.js.LICENSE.txt",
  "drawboard.min.js.map",
];
const sourcePath =
  "/Users/yangzi/Desktop/kc-draw-board/kc-draw-board_1.0.24.1025/dist/";
const targetPath = [
  "/Users/yangzi/Desktop/kc-ocm-client/kc-ocm-client_1.0.24.1025/public/threedWorker/",
  "/Users/yangzi/Desktop/kc-pad-drawboard/public/threedworker/",
];
const copyDrawboard = () => {
  let i = 0;
  files.forEach((file) => {
    targetPath.forEach((target) => {
      fs.copyFile(`${sourcePath}${file}`, `${target}${file}`, () => {
        i++;
        if (i === 6) {
          console.log(chalk.green(`打包文件拷贝成功`));
        }
      });
    });
  });
};

export default copyDrawboard;
