suite('run', function() {
  var run = require('../lib/run').run;
  var runtime = __dirname + '/fixtures/firefox';
  var profileDir = __dirname + '/fixtures/profile';
  var assert = require('assert');

  test('launch firefox', function(done) {
    var options = { profile: profileDir };
    this.timeout(5000);
    run('firefox', runtime, options, function(err, child) {
      assert.ok(!err, err && err.message);
      assert.ok(child.kill, 'is process');
      setTimeout(function() {
        child.kill();
        done();
      }, 2000);
    });
  });

});
