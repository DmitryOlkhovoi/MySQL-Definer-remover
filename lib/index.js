"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _cliSpinner = require("cli-spinner");

var _cliSpinner2 = _interopRequireDefault(_cliSpinner);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _byline = require("byline");

var _byline2 = _interopRequireDefault(_byline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("\n######## ######## ########\n#  ##  # #      # ##    ##\n#  ##  # ###  ### ###  ###\n#  ##  # ###  ### ###  ###\n#  ##  # ###  ### ###  ###\n#  ##  # ###  ### ###  ###\n##    ## ###  ### ##    ##\n######## ######## ########\n".red);

var spinner = new _cliSpinner2.default.Spinner('processing..'.rainbow),
    knownOptions = {
  string: ['definer', 's', 't'],
  default: {
    's': 'db.sql',
    't': 'new.sql'
  }
},
    options = (0, _minimist2.default)(process.argv.slice(2), knownOptions),
    occurs = 0;

if (!options.s || !options.t) {
  console.log('Usage: --s input filepath --t output filepath');
  process.exit();
}

var search = "DEFINER=`" + options.definer + "`@`localhost`",
    regex = new RegExp(search, 'g');

spinner.setSpinnerString('|/-\\');
spinner.start();

console.log(("Source file: " + options.s).cyan);
console.log(("Removing DEFINER: " + options.definer).cyan);
console.log(("Regex string: " + regex).cyan);

var readStream = (0, _byline2.default)(_fs2.default.createReadStream(options.s, { encoding: 'utf8' })).on('data', function (line) {
  if (regex.test(line)) {
    occurs++;
  }
  writeStream.write(line.replace(regex, '') + "\r\n");
}).on('end', function () {
  spinner.stop(true);
  console.log('Done!'.green);
  console.log(("Occurrences: " + occurs).green);
  writeStream.end();
});

var writeStream = _fs2.default.createWriteStream(options.t, { encoding: 'utf8' }).on('close', function () {
  console.log(("SQL has been writen to " + options.t).green);
});