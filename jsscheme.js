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
  console.log(new Pair(1,2).toString());
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});



function Pair(car, cdr) {
    this.car = car;
    this.cdr = cdr;
    this.toString = function() {
        return "(" + car + " . " + cdr + ")"; 
    }
} 

function List(args[]){

    
} 
