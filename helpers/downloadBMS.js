/**
 * @title Setup Audio Extractor Deps
 * @description Downloads and installs the dependencies for audio extraction multiplatform
 * @author Drew Hutton <Yoroshi>
 * When modifying or redistributing this project, do not modify this notice.
 */

const { http, https } = require('follow-redirects');
const fs = require('fs');

/**
 * Downloads file from remote HTTP[S] host and puts its contents to the
 * specified location.
 */
exports.downloadBMS = (url, filePath) => {
  const proto = https;

  const options = {
    host: 'aluigi.altervista.org',
    path: url,
    method: 'GET',
    headers: {
      Host: 'aluigi.altervista.org',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': 1,
      DNT: 1,
      'Sec-GPC': 1,
    },
  };

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = proto.get(options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo));

    request.on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
};
