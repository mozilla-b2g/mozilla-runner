suite('detectbinary', function() {
  var fsPath = require('path');
  var detect = require('../lib/detectbinary');
  var assert = require('assert');

  var platforms = {
    mac: {
      path: __dirname + '/fixtures/product-mac',
      suffix: '/Contents/MacOS',
      platform: 'darwin'
    },
    linux: {
      path: __dirname + '/fixtures/product-linux',
      suffix: '',
      platform: 'linux-bs'
    }
  };

  function verifyBinary(fixture, binary) {
    test('lookup binary for: ' + fixture + ' - ' + binary, function(done) {
      var detail = platforms[fixture];
      var options = { platform: detail.platform };

      if (binary) {
        options.bin = binary;
      } else {
        binary = detect.defaultBin;
      }

      assert.ok(detail, 'missing fixture!');
      detect.detectBinary(
        detail.path,
        options,
        function(err, path) {
          if (err) return done(err);
          var expectedBin = fsPath.join(detail.path, detail.suffix, binary);
          assert.equal(path, expectedBin);
          done();
        }
      );
    });
  }

  // default binary
  verifyBinary('mac');
  verifyBinary('linux');

  // custom binary
  verifyBinary('mac', 'foo-bin');
  verifyBinary('linux', 'foo-bin');

  test('missing binary', function(done) {
    detect.detectBinary(__dirname, { bin: 'nothere' }, function(err) {
      assert.ok(err, 'has error');
      assert.ok(err.message.indexOf(__dirname) !== 0, 'contains path');
      done();
    });
  });

});
