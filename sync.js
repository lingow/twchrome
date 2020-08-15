function syncIntheAm(callback){
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
          updateIconBadge(tasklist);
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
  {'urgency': 15, 'color': "DarkViolet"},
  {'urgency': 12, 'color': "DarkRed"},
  {'urgency': 8, 'color': "Orange"},
  {'urgency': 4, 'color': "DarkGoldenRod"},
  {'urgency': 2, 'color': "ForestGreen"},
  {'urgency': 0, 'color': "DarkCyan"}
];

function updateIconBadge(tasklist) {
  if (!tasklist){
    // For an empty list, remove the badge
    chrome.browserAction.setBadgeText({'text':''});
    return;
  }
  // Sort by urgency
  tasklist.sort((a,b) => b.urgency - a.urgency);
  let count = 0;
  let b = 0;  // b is short for bucket
  let t = 0;  // t is short for task
  for (b = 0; b < urgencybuckets.length; b++) {
    if ( urgencybuckets[b].urgency <= tasklist[t].urgency ){
      break;
    }
  }
  if ( b >= urgencybuckets.length ) {
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
  if (t > 9999) {  // Only 4 characters fit in the space
    t = '0x221E';  // ∞ Infinity. Seriously. Look for help.
  }else {
    t = t.toString();
  }

  chrome.browserAction.setBadgeText({'text':t});
  chrome.browserAction.setBadgeBackgroundColor({'color':urgencybuckets[b].color});
}
