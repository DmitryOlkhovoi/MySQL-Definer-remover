import fs from "fs";
import minimist from "minimist";
import spinnerModule from "cli-spinner";
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

let spinner = new spinnerModule.Spinner('processing..'.rainbow),
  knownOptions = {
    string: [
      'definer',
      's',
      't'
    ],
    default: {
      's': 'db.sql',
      't': 'new.sql'
    }
  },
  options = minimist(process.argv.slice(2), knownOptions),
  occurs = 0;

if(!options.s || !options.t){
  console.log('Usage: --s input filepath --t output filepath');
  process.exit();
}

let search = `DEFINER=\`${options.definer}\`@\`localhost\``,
  regex = new RegExp(search, 'g');

spinner.setSpinnerString('|/-\\');
spinner.start();

console.log(`Source file: ${options.s}`.cyan);
console.log(`Removing DEFINER: ${options.definer}`.cyan);
console.log(`Regex string: ${regex}`.cyan);

let readStream = byline(fs.createReadStream(options.s, {encoding: 'utf8'}))
  .on('data', (line) => {
    if(regex.test(line)){
      occurs++;
    }
    writeStream.write(`${line.replace(regex, '')}\r\n`);
  })
  .on('end', () => {
    spinner.stop(true);
    console.log('Done!'.green)
    console.log(`Occurrences: ${occurs}`.green)
    writeStream.end();
  });

let writeStream = fs.createWriteStream(options.t, {encoding: 'utf8'})
  .on('close', () => {
    console.log(`SQL has been writen to ${options.t}`.green);
  });
