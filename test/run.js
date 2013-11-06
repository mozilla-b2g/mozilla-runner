suite('run', function() {
  var run = require('../lib/run').run;
  var runtime = __dirname + '/fixtures/firefox';
  var assert = require('assert');
  var profile = require('mozilla-profile-builder').firefox.profile;
  var static = require('node-static');

  test('launch firefox', function(done) {
    var profileDir = __dirname + '/fixtures/profile';
    var options = { product: 'firefox', profile: profileDir };
    this.timeout(5000);
    run(runtime, options, function(err, child, bin, argv) {
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
    var port = 60033;
    var config = {
      // turn on dump
      'browser.dom.window.dump.enabled': true
    };

    // create server
    setup(function() {
      var file = new (static.Server)(__dirname + '/html');
      server = require('http').createServer(function(req, res) {
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

    var url = 'http://localhost:' + port + '/dump.html';
    var expected = 'WOOT DUMP';
    test('go to url', function(done) {
      var options = { product: 'firefox', profile: profileDir, url: url };
      run(runtime, options, function(err, child) {
        if (err) return done(err);
        child.stdout.on('data', function(content) {
          content = content.toString();
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
