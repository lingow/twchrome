export function filterTaskList(tasklist, filters){
  for (let i in filters){
    let tf = filters[i];
    if (tf['type'] == "tag"){
      tasklist = tasklist.filter(t => t.tags && t.tags.includes(tf['value']));
    } else if ( tf['type'] == 'project' ){
      tasklist = tasklist.filter(t => t.project && t.project.startsWith(tf['value']));
    }
  }
  return tasklist;
}

export function syncIntheAm(callback?){
  chrome.storage.sync.get('intheamapikey',function(items){
    let apikey = items['intheamapikey'];
    if (apikey) {
      fetch('https://inthe.am/api/v2/tasks/',{
        'method':'GET',
        'headers': {
          'Authorization': "Token ".concat(apikey)
        },
      }).then( response => response.json() )
      .then( function(tasklist) {
        chrome.storage.local.set({'tasklist':tasklist},function(){
          console.log("Updated tasklist");
          withTaskFilters(function(taskfilters){
            updateIconBadge(filterTaskList(tasklist,taskfilters));
          });
          if (callback){
            callback(tasklist);
          }
        });
      });
    } else {
      if (callback){
        callback([]);
      }
    }
  });
}

let urgencybuckets = [
  {'urgency': Number.POSITIVE_INFINITY, 'color': "DarkBlue"},
  {'urgency': 15, 'color': "DarkViolet"},
  {'urgency': 12, 'color': "DarkRed"},
  {'urgency': 8, 'color': "Orange"},
  {'urgency': 4, 'color': "DarkGoldenRod"},
  {'urgency': 2, 'color': "ForestGreen"},
  {'urgency': 0, 'color': "DarkCyan"}
];

export function withTaskFilters(callback){
  chrome.storage.local.get('taskfilters',function(items){
    let taskfilters = items['taskfilters'];
    if (! taskfilters) {
      taskfilters = [];
    }
    callback(taskfilters);
  });
}

function getTaskUrgencyBucket(urgency){
  let b;
  for (b = 1 ; b < urgencybuckets.length ; b++){
    if ( urgencybuckets[b].urgency <= urgency && urgencybuckets[b-1].urgency > urgency){
      return b;
    }
  }
  return undefined;
}

export function getTaskUrgencyColor(urgency){
  let b = getTaskUrgencyBucket(urgency);
  if (! b){
    return undefined;
  }
  return urgencybuckets[b].color;
}

function updateIconBadge(tasklist) {
  if (!tasklist){
    // For an empty list, remove the badge
    chrome.browserAction.setBadgeText({'text':''});
    return;
  }
  // Sort by urgency
  tasklist.sort((a,b) => b.urgency - a.urgency);
  let count = 0;
  let t = 0;  // t is short for task
  let b = getTaskUrgencyBucket(tasklist[t].urgency);

  if (!b) {
    // Display no badge if tasks don't fall into any known urgency buckets
    chrome.browserAction.setBadgeText({'text':''});
    return;
  }
  // Now count the number of tasks in the bucket
  for (t = 0; t < tasklist.length; t++) {
    if (tasklist[t].urgency < urgencybuckets[b].urgency){
      break;
    }
  }
  let badge_text = "";
  if (t > 9999) {  // Only 4 characters fit in the space
    badge_text = '0x221E';  // ∞ Infinity. Seriously. Look for help.
  }else {
   badge_text = t.toString();
  }

  chrome.browserAction.setBadgeText({'text':badge_text});
  chrome.browserAction.setBadgeBackgroundColor({'color':urgencybuckets[b].color});
}
