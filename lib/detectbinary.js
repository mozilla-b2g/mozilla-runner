var fs = require('fs'),
    fsPath = require('path');

module.exports.defaultBin = 'firefox-bin';

var platformPaths = {
  darwin: 'Contents/MacOS'
};

/**
 * Attempts to locate binary based on runtime/platform.
 *
 *    detectBinary(
 *      '/Applications/Firefox',
 *      { bin: 'firefox-bin' },
 *      function(err, firefox) {
 *          // firefox === '/Applications/Firefox/Contents/MacOS/firefox-bin'
 *      }
 *    );
 *
 * Options:
 *  - bin: "firefox-bin" by default
 *  - platform: defaults to process.platform
 *
 * @param {String} source of product runtime.
 * @param {Object} options for detection.
 * @param {Function} callback [err, binaryPath];
 */
function detectBinary(source, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var bin = options.bin || module.exports.defaultBin;
  var platform = options.platform || process.platform;

  var dir = platformPaths[platform] || '';


  // full path to binary
  var binPath = fsPath.join(
    source,
    dir,
    bin
  );

  fs.exists(binPath, function(doesExist) {
    if (!doesExist) {
      return callback(
        new Error('could not detect binary tried: "' + binPath + '"')
      );
    }

    return callback(null, binPath);
  });
}

module.exports.detectBinary = detectBinary;
