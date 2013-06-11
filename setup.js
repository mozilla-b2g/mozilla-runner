var moz = require('mozilla-download');
var fs = require('fs');
var path = __dirname + '/test/fixtures/firefox';

function download() {
  console.log('--*-*--- Downloading Firefox (might take awhile) ----');
  moz.download(
    'firefox',
    path,
    function(err) {
      if (err) {
        console.error('Failed to download firefox', err);
        return process.exit(1);
      }
    }
  );
}

if (!fs.existsSync(path))
  download();

