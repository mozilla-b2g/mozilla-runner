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
 *  mozrun(product, path, options, function(err, child) {
 *
 *  });
 *
 */
function run() {
}

module.exports.run = run;
