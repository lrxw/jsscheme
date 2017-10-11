console.log("hello world");

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', (line) => {
  var line = line.trim();
  parse(line);
  console.log("you said" + line);
  rl.prompt("new Pair(2,3).toString()");
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

function parse(line) {
  console.log("parsing");
  if(line != null && line.startsWith("(") && line.endsWith(")")) {
    console.log("scheme found");
  } else if(line == null) {
    console.log("plz input");
  } else if (!line.startsWith("(")) {
    console.log("start wrong");
  } else if(line.endsWith("(")) {
    console.log("end wrong");
  } else {
    console.log("something wrong")
  }
}

//String.prototype.start

function Pair(car, cdr) {
    this.car = car;
    this.cdr = cdr;
    this.toString = function() {
        return "(" + car + " . " + cdr + ")"; 
    }
} 

//function List(...args){


//} 
