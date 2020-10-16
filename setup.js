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
const rimraf = util.promisify(require('rimraf')); 
const { downloadAndExtract } = require('./helpers/downloadAndExtract');

const platform = os.platform();

const setup = async () => {
  try {
    console.info('Downloading and extracting Universal BMS Scripts...');
    await mkdirp(path.join(__dirname, 'temp'));
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
          'https://vgmstream-builds.s3-us-west-1.amazonaws.com/70d20924341e1df3e4f76b4c4a6e414981950f8e/windows/test.zip',
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

        console.info('Cleaning up vgmstream install...');
        await fs.renameSync(
          path.join(__dirname, 'libs', 'vgmstream', 'test.exe'),
          path.join(__dirname, 'libs', 'vgmstream', 'vgmstream_cli.exe'),
        );

        console.info('Cleaning up ffmpeg install...');
        const ffmpegLatestDirName = fs
          .readdirSync(path.resolve(__dirname, 'libs', 'ffmpeg'))
          .filter((fileName) => fileName.includes('ffmpeg'))[0];

        await rimraf(path.join(__dirname, 'libs', 'ffmpeg', 'bin'));
        fs.renameSync(
          path.join(__dirname, 'libs', 'ffmpeg', ffmpegLatestDirName, 'bin'),
          path.join(__dirname, 'libs', 'ffmpeg', 'bin'),
        );
        await rimraf(
          path.join(__dirname, 'libs', 'ffmpeg', ffmpegLatestDirName),
        );
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
    await rimraf(path.join(__dirname, 'temp'));
    console.info('All deps installed! Get Extracting :)');
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
  }
};

setup();
