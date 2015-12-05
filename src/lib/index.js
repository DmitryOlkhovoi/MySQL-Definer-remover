import fs from "fs";
import ReplaceTransformStream from "./ReplaceTransformStream";
import minimist from "minimist";
import {Spinner} from "cli-spinner";
import colors from "colors";
import byline from "byline";

console.log(`
######## ######## ########
#  ##  # #      # ##    ##
#  ##  # ###  ### ###  ###
#  ##  # ###  ### ###  ###
#  ##  # ###  ### ###  ###
#  ##  # ###  ### ###  ###
##    ## ###  ### ##    ##
######## ######## ########
`.red);

//Text spinner init
let spinner = new Spinner('processing..'.rainbow),

  //Options
  knownOptions = {
    string: [
      'd',
      's',
      't'
    ],
    default: {
      's': 'db.sql',
      't': 'new.sql'
    }
  },

  //Get the arguments from command line
  options = minimist(process.argv.slice(2), knownOptions),

  //The counter for occurs of DEFINER instructions
  occurs = 0;

//Check the validity of the args
if(!options.s || !options.t){
  console.log(`
    Usage:
      -d, --string, "Definer - DEFINER=\`{-d}\`@localhost\`"
      -s, --string, "Input filepath"
      -t --string, "Output filepath"
    `);
  process.exit();
}

//Search string
let search = `DEFINER=\`${options.d}\`@\`localhost\``,

  //Regex for searching
  regex = new RegExp(search, 'g');

//Run text spinner
spinner.setSpinnerString('|/-\\');
spinner.start();

console.log(`Source file: ${options.s}`.cyan);
console.log(`Removing DEFINER: ${options.d}`.cyan);
console.log(`Regex string: ${regex}`.cyan);

let readStream = fs.createReadStream(options.s, {encoding: 'utf8'})
  .on('end', () => {
      spinner.stop(true);
      console.log('Done!'.green)
      // console.log(`Occurrences: ${occurs}`.green)
    }),
  replaseStream = new ReplaceTransformStream(regex, {encoding: 'utf8'}),
  writeStream = fs.createWriteStream(options.t, {encoding: 'utf8'})
  .on('close', () => {
    console.log(`SQL has been writen to ${options.t}`.green);
  });

byline(readStream)
  .pipe(replaseStream)
  .pipe(writeStream);
