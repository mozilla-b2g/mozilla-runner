suite('run', function() {
  var run = require('../lib/run').run;
  var runtime = __dirname + '/fixtures/firefox';
  var assert = require('assert');
  var profile = require('mozilla-profile-builder').firefox.profile;
  var static = require('node-static');

  test('launch firefox', function(done) {
    var profileDir = __dirname + '/fixtures/profile';
    var options = { profile: profileDir };
    run('firefox', runtime, options, function(err, child, bin, argv) {
      assert.ok(!err, err && err.message);

      // verify the binary
      assert.ok(bin.indexOf('firefox-bin') !== 0, 'has bin');

      // verify arguments
      assert.deepEqual(
        argv,
        ['-profile', profileDir, '-no-remote']
      );

      // verify we have a child
      assert.ok(child.kill, 'is process');
      child.kill();
      done();
    });
  });

  suite('launch firefox read dump', function() {
    var server;
    var port = 60036;
    var config = {
      // turn on dump
      'browser.dom.window.dump.enabled': true
    };

    // create server
    setup(function() {
      var file = new (static.Server)(__dirname + '/html');
      server = require('http').createServer(function(req, res) {
        console.log('>>>!', req.headers.host, '<<< HIT!');
        // stolen from node-static
        req.on('end', function() {
          file.serve(req, res);
        }).resume();
      });
      server.listen(port);
    });

    // ensure server gets closed
    teardown(function() {
      server.close();
    });

    // create tmp profile
    var profileDir;
    setup(function(done) {
      profile({ userPrefs: config }, function(err, _profileDir) {
        if (err) return done(err);
        profileDir = _profileDir;
        done();
      });
    });

    var url = 'http://127.0.0.1:' + port + '/dump.html';
    var expected = 'WOOT DUMP';
    test('go to url', function(done) {
      var options = { profile: profileDir, url: url };
      console.log(require('fs').readFileSync(profileDir + '/user.js', 'utf8'));
      run('firefox', runtime, options, function(err, child) {
        if (err) return done(err);
        child.stdout.on('data', function(content) {
          content = content.toString();
          console.log('GOT CONTENT?', content);
          // verify we can go to a given url
          if (content.indexOf(expected) !== -1) {
            child.kill();
            done();
          }
        });
      });
    });
  });

});
