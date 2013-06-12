var detectBinary = require('./detectbinary').detectBinary,
    debug = require('debug')('mozilla-runner:run'),
    spawn = require('child_process').spawn,
    fs = require('fs');

// private helper for building the argv
function buildArgv(product, options) {
  var argv = [];

  if (options.argv)
    argv = argv.concat(options.argv);

  if (options.profile) {
    argv.push('-profile');
    argv.push(options.profile);
  }


  if (options.noRemote !== false)
    argv.push('-no-remote');

  if (options.url)
    argv.push(options.url);

  return argv;
}

function resolveOptions(product, path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  if (!options)
    options = {};

  if (typeof options.profile !== 'function')
    return setTimeout(callback, 0, null, options);

  options.profile(product, path, options, function(err, profilePath) {
    if (err) return callback(err);
    options.profile = profilePath;
    callback(err, options);
  });
}

/**
 * Run an instance of a mozilla runtime/product.
 *
 * Options:
 *  - (String|Function) profile: expects a string path to the profile
 *                               or a function that accepts a callback
 *                               that will return the string path to the
 *                               profile itself.
 *  - (noRemote): defaults to true (-no-remote flag)
 *  - (Array) argv: additional arguments to pass to process
 *
 *  var options = {}
 *  mozrun(product, path, options, function(err, child, binary, argv) {
 *
 *  });
 */
function run(product, path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  // resolve binary for product
  var binPath;

  // handler for creating process
  function spawnProduct() {
    var argv = buildArgv(product, options);
    debug('building argv', argv);
    // spawn child process
    var child = spawn(
      binPath,
      argv
    );

    callback(null, child, binPath, argv);
  }

  var pending = 2;
  function next() {
    if (--pending === 0)
      return spawnProduct();
  }

  resolveOptions(product, path, options, function(err, _options) {
    options = _options;
    debug('resolving options', options);
    next();
  });

  function foundBinary(err, _binPath) {
    if (err) return callback(err);
    binPath = _binPath;
    debug('found bin', binPath);
    next();
  }

  var bin = product + '-bin';
  debug('finding bin:', bin);
  detectBinary(
    path,
    { bin: bin },
    foundBinary
  );
}

module.exports.run = run;
