Array.prototype.contains = function(obj) {
    var i, listed = false;
    for (i=0; i<this.length; i++) {
        if (this[i] === obj) {
            listed = true;
            break;
        }
    }
    return listed;
};

function Pair(car,cdr) {
    this.car = car;
    this.cdr = cdr;
    this.toString = function() {
        if (is_null(this.cdr)) {
            return "(" + this.car + ")";
        }
        if (is_pair(this.cdr)) {
            return "(" + this.car + " " + this.cdr.toString().substring(1,this.cdr.toString().length);
        }
        return "(" + this.car + " . " + this.cdr + ")";
    };
    this.eval = function(env) {
        operation = evaluate(this.car,env);
        args = new Array();
        if (!is_null(this.cdr)) {
            args = this.cdr;
        }
        if (operation instanceof Specialform) {
            return operation.call(env, [arg for (arg in args)].slice(0,-1));
        }
        return operation.call([evaluate(arg,env) for (arg in args)].slice(0,-1));
    };
    /* only working with JS 1.7*/
    this.__iterator__ = function() {
        yield this.car;
        if (is_pair(this.cdr)) {
            for (e in this.cdr) yield e;
        }
        else {
            yield this.cdr
        }
    };    
}

function Symbol(string) {
    this.value = string;
    this.toString = function() {
        return this.value;
    };
    this.eval = function(env) {
        return env.lookup(this);
    };
}

function Environment(prevEnv,keys) {
    this.prevEnv = prevEnv;
    this.keys = keys;
    this.map = new Array();
    this.bind = function(key,val) {
        if (!this.keys.contains(key)) {
            this.keys.push(key);
        }
        this.map[key] = val;
    };
    this.bindVals = function(values) {
        if (this.keys.length <= values.length) {
            for (i=0;i<this.keys.length;i++) {
                this.map[this.keys[i]] = values[i];
            }
        }
        if (this.keys.length < values.length) {
            this.map[this.keys[this.keys.length-1]] = values
        }
    };
    this.lookup = function(key) {
        if (this.map[key] != null) {
            return this.map[key];
        } else if(this.prevEnv != null) {
            return this.prevEnv.lookup(key);
        } 
        throw "lookup failed";
    };
}

function Procedure(env,body) {
    this.env = env;
    this.body = body;
    this.call = function(args) {
        this.env.bindVals(args);
        return evaluate(this.body,this.env);
    }
}

function Specialform() {}


function Lambda() {
    this.call = function(env,args) {
        var body = args[1];
        var params = new Array();
        if (!is_null(args[0])) {
            params = args[0];
        }
        env = new Environment(env,[param for (param in params)].slice(0,-1));
        return new Procedure(env,body);
    }
}
Lambda.prototype = new Specialform();

function Quote() {
    this.call = function(env,args) {
        return args[0];
    }
}
Quote.prototype = new Specialform();

function Define() {
    this.call = function(env,args) {
        var symbol = args[0];
        var expr = args[1];
        env.bind(symbol,evaluate(expr,env));
    }
}
Define.prototype = new Specialform();

function If() {
    this.call = function(env,args) {
        var test = args[0];
        var consequent = args[1];
        var alternate = args[2];
        var cond = eval(test,env);
        if (cond != false) {
            return eval(consequent,env);
        } else if (alternate) {
            return eval(alternate,env);
        }
        return null;
    }
}
If.prototype = new Specialform();


function evaluate(obj, env){
    try {
        return obj.eval(env);
    } catch(e) {
        return obj;
    }    
}

function _EmptyList() {
    this.toString = function() {
        return "()";
    }
}

EL = new _EmptyList();

function cons(car,cdr) {
    return new Pair(car,cdr);
}

function car(pair) {
    return pair.car;
}

function cdr(pair) {
    return pair.cdr;
}

function is_pair(obj) {
    return obj instanceof Pair;
}

function is_number(obj) {
    if (!isNaN(parseFloat(obj))) {
        return true;
    } else {
        return false;
    }
}

function is_boolean(obj) {
    try {
        boolstring = obj.toString();
        if (boolstring == "true" || boolstring == "false") {
            return true;
        }
        return false;
    } catch(e) {
        return false;
    }
}

function is_null(obj) {
    return obj === EL;
}

function is_symbol(obj) {
    return obj instanceof Symbol;
}

function count_elements(list) {
    count = 0;
    while(is_list(cdr(list))) {
        count++;
        list = cdr(list);
    }
    return count;
}

/* this method can handle a variable count of parameters */
function make_list() {
    var list = EL;
    for(var i=arguments.length-1;i>=0;i--) {
        list = new Pair(arguments[i],list);
    }
    return list;
}

function is_list(obj) {
    if (is_null(obj)) {
        return true;
    } else if (is_pair(obj)) {
        if (is_null(cdr(obj))) {
            return true;
        } else if (is_pair(cdr(obj))) {
            return is_list(cdr(obj));
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function sym(name) {
    return new Symbol(name);
}


// +++ Native Methods +++ 


function Native_Method() {}

function Plus() {
    this.call = function(args) {
        var result = args[0];
        var i = 1;
        while (args[i] != null) {
            result += args[i];
            i++;
        }
        return result;
    }
}
Plus.prototype = new Native_Method();

function Minus() {
    this.call = function(args) {
        var result = args[0];
        var i = 1;
        while (args[i] != null) {
            result -= args[i];
            i++;
        }
        return result;
    }
}
Minus.prototype = new Native_Method();

function Multiply() {
    this.call = function(args) {
        var result = 1;
        var i = 0;
        while (args[i] != null) {
            result *= args[i];
            i++;
        }
        return result;
    }
}
Multiply.prototype = new Native_Method();

function Divide() {
    this.call = function(args) {
        var result = 1;
        var i = 0;
        while (args[i] != null) {
            result *= args[i];
            i++;
        }
        return result;
    }
}
Divide.prototype = new Native_Method();

function Cons() {
    this.call = function(args) {
        return new Pair(args[0], args[1]);
    }
}
Cons.prototype = new Native_Method();

function Is_Pair() {
    this.call = function(args) {
        return is_pair(args[0]);
    }
}
Is_Pair.prototype = new Native_Method();

function Is_Number() {
    this.call = function(args) {
        return is_pair(args[0]);
    }
}
Is_Pair.prototype = new Native_Method();

function Is_Bool() {
    this.call = function(args) {
        return is_boolean(args[0]);
    }
}
Is_Bool.prototype = new Native_Method();

function Car() {
    this.call = function(args) {
        return car(args[0]);
    }
}
Car.prototype = new Native_Method();

function Cdr() {
    this.call = function(args) {
        return cdr(args[0]);
    }
}
Cdr.prototype = new Native_Method();

keys0 = new Array();
keys0.push(new Symbol("+"));
keys0.push(new Symbol("-"));
keys0.push(new Symbol("*"));
keys0.push(new Symbol("/"));
keys0.push(new Symbol("lambda"));
keys0.push(new Symbol("define"));
keys0.push(new Symbol("quote"));
keys0.push(new Symbol("if"));
keys0.push(new Symbol("pair?"));
keys0.push(new Symbol("number?"));
keys0.push(new Symbol("boolean?"));
keys0.push(new Symbol("cons"));
keys0.push(new Symbol("car"));
keys0.push(new Symbol("cdr"));


values0 = new Array();
values0.push(new Plus());
values0.push(new Minus());
values0.push(new Multiply());
values0.push(new Divide());
values0.push(new Lambda());
values0.push(new Define());
values0.push(new Quote());
values0.push(new If());
values0.push(new Is_Pair());
values0.push(new Is_Number());
values0.push(new Is_Bool());
values0.push(new Cons());
values0.push(new Car());
values0.push(new Cdr());


env0 = new Environment(null,keys0);
env0.bindVals(values0);



function evalInput() {
    document.getElementById("output").value = eval(document.getElementById("input").value);
}





