import 'jquery';
import 'bootstrap';
import './sync';

let intheamapikey = <HTMLInputElement>document.getElementById('intheamapikey');
chrome.storage.sync.get('intheamapikey', function(items) {
  intheamapikey.value = items['intheamapikey'] ;
})

let refreshinterval = <HTMLInputElement>document.getElementById('refreshinterval');
chrome.storage.sync.get('refreshinterval', function(items) {
  refreshinterval.value = items['refreshinterval'] ;
})

let optionsform = <HTMLFormElement>document.getElementById('optionsform');
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

