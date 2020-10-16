/**
 * @title Setup Audio Extractor Deps
 * @description Downloads and installs the dependencies for audio extraction multiplatform
 * @author Drew Hutton <Yoroshi>
 * When modifying or redistributing this project, do not modify this notice.
 */

const { download } = require('./download');
const { downloadBMS } = require('./downloadBMS');
const { extract } = require('./extract');

/**
 * Merge of download and extract functions
 */
exports.downloadAndExtract = async (url, downloadPath, extractDir, isBMS) => {
  isBMS
    ? await downloadBMS(url, downloadPath)
    : await download(url, downloadPath);
  await extract(downloadPath, extractDir);
};
