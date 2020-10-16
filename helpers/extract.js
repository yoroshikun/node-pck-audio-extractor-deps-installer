/**
 * @title Setup Audio Extractor Deps
 * @description Downloads and installs the dependencies for audio extraction multiplatform
 * @author Drew Hutton <Yoroshi>
 * When modifying or redistributing this project, do not modify this notice.
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const yauzl = require('yauzl');

/**
 * Extracts a compressed file and puts its contents to the
 * specified location. (one level deep)
 */
exports.extract = async (downloadPath, extractDir) => {
  new Promise((resolve, reject) =>
    yauzl.open(downloadPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) throw err;
      zipfile.readEntry();
      zipfile.on('entry', async (entry) => {
        if (/\/$/.test(entry.fileName)) {
          await mkdirp(path.dirname(path.join(extractDir, entry.fileName)));
          zipfile.readEntry();
        } else {
          await mkdirp(path.dirname(path.join(extractDir, entry.fileName)));
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) throw err;
            readStream.on('end', () => {
              zipfile.readEntry();
            });
            readStream.pipe(
              fs.createWriteStream(`${extractDir}/${entry.fileName}`),
            );
          });
        }
      });
    }),
  );
};
