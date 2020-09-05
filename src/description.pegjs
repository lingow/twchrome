{
  const chrono = require('chrono-node');
}

root
	= (_)? commandline:commandline (_)? {
    	// Transform the parsed command to match expected task format
        // https://intheam.readthedocs.io/en/latest/api/task_format.html
       	let task = commandline['task']; 
        // Description should be a string.
        if( 'description' in task ){
        	task['description']=task['description'].join(" ");
        }
        // For the following keywords, keep only the latest value
        [
        	"project",
            "priority",
            "due",
            "wait",
            "until",
            "scheduled",
            "start"].forEach( (keyword) => {
            if ( keyword in task ){
            	task[keyword] = task[keyword][task[keyword].length - 1];
            }
        });

        // For the following keywords, convert to iso string
        ["scheduled","until","wait","due"].forEach((keyword) => {
            if ( keyword in task ){
              const parsedDate= chrono.parseDate(task[keyword]);
            	task[keyword] = parsedDate.toISOString();
            }
          });
    	return commandline;
    }

commandline
	= command:(command _)? tokens:tokens {
    	const ret = {
        	'command':'filter',
        	task : tokens
            };
        if (command) {
        	ret['command'] = command[0];
        }
        return ret;
    }

command
	= add / filter
    
add
	=("a"("d"("d")?)?){ return "add"}
    
filter
	=("f"("i"("l"("t"("e"("r")?)?)?)?)?) { return "filter"}

tokens
  = head:item tail:(_ tokens)* {
  	if (tail[0]){
    	tail = tail[0][1];
    } else {
    	tail = {}
    }
    for( let key in head ){
    	if (key in tail) {
        	if (! tail[key]){
            	tail[key]=[];
            }
        	tail[key].unshift(...head[key])
        } else {
        	tail[key] = head[key]
        }
    }
    return tail;
  }

item
	= keyword:(keyword)? payload:(payload)? {
    	if (keyword){
        	let ret = {}
            if (! payload){
            	payload=[];
            }
            ret[keyword] = payload;
        	return ret;
        }
    	return {'description': payload}
    }

keyword
   = (tags/project/priority/depends/due/wait/until/scheduled/start/annotations)

tags
  = ("+" / ("t"("a"("g"("s")?)?)? ":")) { 
  return "tags";
	}

project
  = ("pro"("j"("e"("c"("t")?)?)?)? ":"){ 
  return "project";
	}
    
priority
  = ("pri"("o"("r"("i"("t"("y")?)?)?)?)? ":") { 
  return "priority";
	}

depends
  = ("de"("p"("e"("n"("d"("s")?)?)?)?)? ":") { 
  return "depends";
	}
    
due
  = ("du"("e")? ":") { 
  return "due";
	}

wait
  = ("w"("a"("i"("t")?)?)? ":") { 
  return "wait";
	}

until
  = ("u"("n"("t"("i"("l")?)?)?)? ":") { 
  return "until";
	}

scheduled
  = ("sc"("h"("e"("d"("u"("l"("e"("d")?)?)?)?)?)?)? ":")  { 
  return "scheduled";
	}
    
start
  = ("st"("a"("r"("t")?)?)? ":") { 
  return "start";
	} 

annotations
  = ("a"("n"("n"("o"("t"("a"("t"("i"("o"("n"("s")?)?)?)?)?)?)?)?)?)? ":") {
  	return "annotations"
  }

payload
   = head:escaped_term tail:( "," payload )* {
     if (tail[0]){
     	tail=tail[0][1];
     }
     if (! tail) {
     	tail=[];
     }
     tail.unshift(head);
     return tail;
   }

escaped_term
  =whole:(quoted_term/val:($("\\ "/[^ ,])+) {return val.replace(/\\ /g," ")})+ {
  	return whole.join("");
  }

quoted_term
  = "\"" val:double_quoted_term "\"" { return val.replace(/\\"/g,"\"") }
	/ "'" val:single_quoted_term "'" { return val.replace(/\\'/g,"'") }
  
double_quoted_term
  =$ ("\\\""/[^"])*
  
single_quoted_term
  =$ ("\\'"/[^'])*
  
_
  = [ \t\n\r]+
