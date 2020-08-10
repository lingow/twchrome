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
