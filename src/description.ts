export function parseDescription(description){
  // See https://intheam.readthedocs.io/en/latest/api/task_format.html for the
  // accepted format.
  let keywords = {
    "tags": /\B\+(\S*)\b/,
    "project": /\bproj?e?c?t?:(\S*)\b/,
    "priority": /\bprio?r?i?t?y?:(H|M|L)\b/,
    "depends": /\bdep?e?n?d?s?:(\S*)\b/,
    "due": /\bdue?:(\S*)\b/,
    "wait": /\bwa?i?t?:(\S*)\b/,
    "until": /\bun?t?i?l?:(\S*)\b/,
    "scheduled": /\bsch?e?d?u?l?e?d?:(\S*)\b/,
    "start": /\bsta?r?t?:(\S*)\b/,
    "annotations": /\ban?n?o?t?a?t?i?o?n?s?:(\S*)\b/
  };
  let pure_description: string[] = [];

  let newtask : any = {};
  let words = description.split(" ");
  for (let i in words){
    let word = words[i];
    let m:RegExpMatchArray = []; 
    for ( let k in keywords ) {
      let regex = keywords[k];
      m = word.match(regex);
      if (m) {
        if ( ["tags","depends","annotations"].includes(k) ) {
          // These are tokens that can be specified multiple times or 
          // through comma separated lists
          if ( !newtask[k]) {
            newtask[k] = [];
          }
          newtask[k].push(...m[1].split(","));
        } else {
          newtask[k]=m[1];
        }
        break;
      }
    }
    if (!m) {
      pure_description.push(word);
    }
  }

  newtask['description'] = pure_description.join(" ");
  
  return newtask; 
}
