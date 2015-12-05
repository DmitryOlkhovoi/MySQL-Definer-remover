"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _ReplaceTransformStream = require("./ReplaceTransformStream");

var _ReplaceTransformStream2 = _interopRequireDefault(_ReplaceTransformStream);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _cliSpinner = require("cli-spinner");

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _byline = require("byline");

var _byline2 = _interopRequireDefault(_byline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("\n######## ######## ########\n#  ##  # #      # ##    ##\n#  ##  # ###  ### ###  ###\n#  ##  # ###  ### ###  ###\n#  ##  # ###  ### ###  ###\n#  ##  # ###  ### ###  ###\n##    ## ###  ### ##    ##\n######## ######## ########\n".red);

//Text spinner init
var spinner = new _cliSpinner.Spinner('processing..'.rainbow),

//Options
knownOptions = {
  string: ['d', 's', 't'],
  default: {
    's': 'db.sql',
    't': 'new.sql'
  }
},

//Get the arguments from command line
options = (0, _minimist2.default)(process.argv.slice(2), knownOptions),

//The counter for occurs of DEFINER instructions
occurs = 0;

//Check the validity of the args
if (!options.s || !options.t) {
  console.log("\n    Usage:\n      -d, --string, \"Definer - DEFINER=`{-d}`@localhost`\"\n      -s, --string, \"Input filepath\"\n      -t --string, \"Output filepath\"\n    ");
  process.exit();
}

//Search string
var search = "DEFINER=`" + options.d + "`@`localhost`",

//Regex for searching
regex = new RegExp(search, 'g');

//Run text spinner
spinner.setSpinnerString('|/-\\');
spinner.start();

console.log(("Source file: " + options.s).cyan);
console.log(("Removing DEFINER: " + options.d).cyan);
console.log(("Regex string: " + regex).cyan);

var readStream = _fs2.default.createReadStream(options.s, { encoding: 'utf8' }).on('end', function () {
  spinner.stop(true);
  console.log('Done!'.green);
  // console.log(`Occurrences: ${occurs}`.green)
}),
    replaseStream = new _ReplaceTransformStream2.default(regex, { encoding: 'utf8' }),
    writeStream = _fs2.default.createWriteStream(options.t, { encoding: 'utf8' }).on('close', function () {
  console.log(("SQL has been writen to " + options.t).green);
});

(0, _byline2.default)(readStream).pipe(replaseStream).pipe(writeStream);