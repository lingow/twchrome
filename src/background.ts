import { syncIntheAm } from './sync'

chrome.runtime.onInstalled.addListener(function() {
  let sync_defaults = {
    'intheamapikey':'',
    'refreshinterval':2,
  };
  chrome.storage.sync.get(Object.keys(sync_defaults),function(items){
    for (let key in items){
      delete sync_defaults['key']
    }
    chrome.storage.sync.set(sync_defaults);
  });
  let local_defaults = {
    'tasklist':[]
  };
  chrome.storage.sync.get(Object.keys(local_defaults),function(items){
    for (let key in items){
      delete local_defaults['key']
    }
    chrome.storage.local.set(local_defaults);
  });
});

chrome.storage.onChanged.addListener(function(changes,namespace) {
  for (let key in changes) {
    let storageChange = changes[key];
    switch(key) {
      case 'refreshinterval':
      case 'intheamapikey':
        chrome.storage.sync.get(['intheamapikey','refreshinterval'],function(items){
          let intheamapikey=items['intheamapikey']
          if (intheamapikey){
            let refreshinterval=items['refreshinterval']
            // create or replace the alarm
            chrome.alarms.create('intheamsyncalarm',{'periodInMinutes':refreshinterval});
          }
          else {
            // delete the alarm if exists
            chrome.alarms.clear('intheamsyncalarm')
          }
        });
        break;
      default:
        console.log("No action specified for storage change of "+key);
    }
  }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  switch (alarm.name) {
    case 'intheamsyncalarm':
      syncIntheAm();
      break;
    default:
      console.log("No action specified for alarm " + alarm.name);
  }
});
