let intheamapikey = document.getElementById('intheamapikey');
chrome.storage.sync.get('intheamapikey', function(items) {
  intheamapikey.value = items['intheamapikey'] ;
})

let refreshinterval = document.getElementById('refreshinterval');
chrome.storage.sync.get('refreshinterval', function(items) {
  refreshinterval.value = items['refreshinterval'] ;
})

let optionsform = document.getElementById('optionsform');
optionsform.addEventListener('submit', function(e) {
  chrome.storage.sync.set({'intheamapikey':intheamapikey.value}, function() {
    console.log("Updated the api key.");
    syncIntheAm();
  })
  chrome.storage.sync.set({'refreshinterval':parseInt(refreshinterval.value)}, function() {
    console.log("Updated the refresh interval.");
  })
});

let syncnowbutton = document.getElementById('syncnowbutton');
syncnowbutton.addEventListener('click', function() {
  syncIntheAm();
});

