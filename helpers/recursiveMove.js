/**
 * @title Setup Audio Extractor Deps
 * @description Recursivly moves all files from one dir to another
 * @author Drew Hutton <Yoroshi>
 * When modifying or redistributing this project, do not modify this notice.
 */
const fs = require("fs");
const path = require("path");

/**
 * Recursively moves all files from one dir to another
 *
 * @param {string} from - The source directory
 * @param {string} to - The destination directory
 */
const recursiveMove = (from, to) => {
  const files = fs.readdirSync(from);

  files.forEach((file) => {
    const fromPath = path.join(from, file);
    const toPath = path.join(to, file);

    if (fs.statSync(fromPath).isDirectory()) {
      if (!fs.existsSync(toPath)) {
        fs.mkdirSync(toPath);
      }
      recursiveMove(fromPath, toPath);
    } else {
      fs.renameSync(fromPath, toPath);
    }
  });
  fs.rmdirSync(from);
};

exports.recursiveMove = recursiveMove;
