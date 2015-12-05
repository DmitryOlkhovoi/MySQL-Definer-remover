import util from "util";
import {Transform} from "stream";

function ReplaseStream(regex, options){
  if(!regex) throw "Regex must to be set";

  if (!(this instanceof ReplaseStream)){
    return new ReplaseStream(regex, options);
  }

  Transform.call(this, options);
  this.regex = regex;
}

util.inherits(ReplaseStream, Transform);

ReplaseStream.prototype._transform = function(line, encoding, done) {
  if(this.regex.test(line)){
    this.push(`${line.replace(this.regex, '')}\r\n`);
  }

  done();
}

export default ReplaseStream;
