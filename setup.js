/**
 * @title Setup Audio Extractor Deps
 * @description Downloads and installs the dependencies for audio extraction multiplatform
 * @author Drew Hutton <Yoroshi>
 * When modifying or redistributing this project, do not modify this notice.
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const commandExists = require('command-exists');
const util = require('util');
const exec = util.promisify(require('child_process').execFile);
const { downloadAndExtract } = require('./helpers/downloadAndExtract');
const { rmraf } = require('./helpers/rmraf');

const platform = os.platform();

const setup = async () => {
  try {
    console.info('Downloading and extracting Universal BMS Scripts...');
    await mkdirp('temp');
    await downloadAndExtract(
      '/bms/quickbms_scripts.zip',
      'temp/quickbms_scripts.zip',
      'libs/quickbms/scripts',
      true,
    );

    switch (platform) {
      case 'win32':
        console.info('Downloading and extracting VGMStream Deps...');
        await downloadAndExtract(
          'https://f.losno.co/vgmstream-win32-deps.zip',
          'temp/vgmstream-win32-deps.zip',
          'libs/vgmstream',
        );
        console.info('Downloading and extracting VGMStream CLI...');
        await downloadAndExtract(
          'https://github.com/losnoco/vgmstream/releases/download/r1050-3312-g70d20924/vgmstream_cli.zip',
          'temp/vgmstream_cli.zip',
          'libs/vgmstream',
        );
        console.info('Downloading and extracting ffmpeg... (Large)');
        await downloadAndExtract(
          'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip',
          'temp/ffmpeg-release-essentials.zip',
          'libs/ffmpeg',
        );

        console.info('Downloading and extracting BMS...');
        await downloadAndExtract(
          '/papers/quickbms.zip',
          'temp/quickbms.zip',
          'libs/quickbms',
          true,
        );

        console.info('Cleaning up ffmpeg install...');
        const ffmpegLatestDirName = fs
          .readdirSync('ffmpeg')
          .filter((fileName) => fileName.includes('ffmpeg'))[0];

        await rmraf(path.join('ffmpeg', 'bin'));
        fs.renameSync(
          path.join(__dirname, './ffmpeg', ffmpegLatestDirName, 'bin'),
          path.join(__dirname, './ffmpeg', 'bin'),
        );
        await rmraf(path.join('ffmpeg', ffmpegLatestDirName));
        break;
      case 'darwin':
        console.info('Checking if brew and required commands are installed...');
        if (!commandExists('brew')) {
          throw new Error('brew command is not installed!');
        }
        if (!commandExists('vgmstream123') || !commandExists('ffmpeg')) {
          console.info('Installing VGMStream and ffmpeg with brew...');
          await exec('brew', ['install', 'vgmstream', 'ffmpeg']);

          console.info('Checking if vgmstream is installed...');
          if (!commandExists('vgmstream123')) {
            throw new Error('vgmstream command is not installed!');
          }
          console.info('Checking if ffmpeg is installed...');
          if (!commandExists('ffmpeg')) {
            throw new Error('ffmpeg command is not installed!');
          }
        }

        console.info('Downloading and extracting BMS...');
        await downloadAndExtract(
          '/papers/quickbms_macosx.zip',
          'temp/quickbms.zip',
          'libs/quickbms',
          true,
        );

        break;
      case 'linux':
        console.info('Checking if brew and required commands are installed...');
        if (!commandExists('brew')) {
          throw new Error('brew command is not installed!');
        }

        if (!commandExists('vgmstream123') || !commandExists('ffmpeg')) {
          console.info('Installing VGMStream and ffmpeg with brew...');
          await exec('brew', ['install', 'vgmstream', 'ffmpeg']);

          if (!commandExists('vgmstream123')) {
            throw new Error('vgmstream command is not installed!');
          }
          if (!commandExists('ffmpeg')) {
            throw new Error('ffmpeg command is not installed!');
          }
        }

        console.info('Downloading and extracting BMS...');
        await downloadAndExtract(
          '/papers/quickbms_linux.zip',
          'temp/quickbms.zip',
          'libs/quickbms',
          true,
        );

        break;
      default:
        console.error('The current platform is not supported');
        break;
    }
    await rmraf('temp');
    console.info('All deps installed! Get Extracting :)');
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
  }
};

setup();
