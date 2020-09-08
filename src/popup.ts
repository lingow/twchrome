var $ = require('jquery');
import 'popper.js';
import 'bootstrap';
import { filterTaskList, syncIntheAm, getTaskUrgencyColor } from './sync';
import { parseDescription } from './description';


const hashCode=s=>{for(var i=0,h;i<s.length;i++)h=Math.imul(31,h)+s.charCodeAt(i)|0;return h}

let badge_colors=[
  "badge-primary",
  "badge-secondary",
  "badge-success",
  "badge-danger",
  "badge-warning",
  "badge-info",
  "badge-light",
  "badge-dark"
];

function loadTheTaskList() {
  chrome.storage.local.get(['tasklist','taskfilters'],function(items){
    let tasklist = <HTMLUListElement>document.getElementById("tasklist");
    tasklist.innerHTML='';
    let servertasklist = items['tasklist']
    let taskfilters = items['taskfilters'];
    if (taskfilters) {
      let filter_list = <HTMLDivElement>document.getElementById("filter-list");
      servertasklist = filterTaskList(servertasklist,taskfilters);
      for( let i in taskfilters ){
        let tf = taskfilters[i];
        let filter_badge = document.createElement("div");
        filter_badge.classList.add("badge");
        filter_badge.classList.add("badge-pill");
        let badge_color=badge_colors[hashCode(tf['value']) % badge_colors.length];
        filter_badge.classList.add(badge_color);
        let a = document.createElement("a");
        a.href="#";
        a.addEventListener("click",function(){
          removeTaskFilter(tf,updateTaskList);
        });
        let filterprefix = {
          'description':'d:',
          'project':'p:',
          'tag':'+',
        }[tf['type']];
        filter_badge.appendChild(document.createTextNode(filterprefix + tf['value'] +  " [x]"));
        a.appendChild(filter_badge);
        filter_list.appendChild(a);
      }
    }
    servertasklist.sort( (a,b) => b.urgency - a.urgency);
    for (let i in servertasklist) {
      let task = servertasklist[i];
      let node = taskToHTMLNode(task);
      tasklist.appendChild(node);
    }

  });
}
loadTheTaskList();


async function updateTaskList(){
  // This function should actually
  // Get the stored tasklist
  // Request the server for the new tasklist
  // Get the differences
  // Update the ui to reflect the differences
  // Focus on the task adding textbox
  return new Promise( resolve => {
    syncIntheAm(function() { 
      resolve();
      location.reload(); // for the lazy

    }); 
  });
}

async function addTaskFilter(spec, callback?) : Promise<string>{
  return new Promise( resolve => {
    chrome.storage.local.get('taskfilters',function(items){
      let taskfilters = items['taskfilters'];
      if (! taskfilters ) {
        taskfilters=[];
      }
      if (! taskfilters.some(tf => tf.value == spec.value && tf.type == spec.type)) {
        taskfilters.push(spec);
        chrome.storage.local.set({'taskfilters':taskfilters}, async function(){
          if (callback) {
            await callback(taskfilters)
          }
          resolve('ok');
        });
      }
    });
  });
}

function removeTaskFilter(spec, callback){
  chrome.storage.local.get('taskfilters',function(items){
    let taskfilters = items['taskfilters'];
    taskfilters = taskfilters.filter( tf => ! ( tf.value == spec.value && tf.type == spec.type ) );
    chrome.storage.local.set({'taskfilters':taskfilters}, function(){
      callback(taskfilters)
    });
  });
}

function taskToHTMLNode(task){
  let task_listitem =
    <HTMLLIElement>((<Element>(<HTMLTemplateElement>document.getElementById('taskentry_template')).content.cloneNode(true)).querySelector('.list-group-item'));
  let heading = <HTMLDivElement>task_listitem.querySelector(".widget-heading");
  heading.appendChild(document.createTextNode(task.description));

  let link = <HTMLAnchorElement>task_listitem.querySelector(".task-link");
  link.title = task.description;
  link.href = "https://inthe.am/tasks/" + task.id;

  if (task.project) {
    let project_components = task.project.split(".");
    let subheading = <HTMLDivElement>task_listitem.querySelector(".widget-subheading");
    for (let i = 0 ; i < project_components.length ; i++) {
      let project_component = project_components[i];
      let a = document.createElement("a");
      a.appendChild(document.createTextNode(project_component));
      a.href="#";
      a.addEventListener("click", function () {
        addTaskFilter({
          "type": "project",
          "value": project_components.slice(0,i+1).join(".")
        },updateTaskList);
      });
      if ( i > 0 ) {
        subheading.appendChild(document.createTextNode("."));
      }
      subheading.appendChild(a);
    }
  }
  if (task.tags) {
    for ( let i in task.tags ){
      let tag_a = document.createElement('a');
      tag_a.href="#";
      let tag = task.tags[i];
      let tag_node =
        <HTMLDivElement>(<Element>(<HTMLTemplateElement>document.getElementById('tasktag_template')).content.cloneNode(true)).querySelector(".badge");
      tag_node.appendChild(document.createTextNode(tag));
      tag_a.appendChild(tag_node);

      let badge_color=badge_colors[hashCode(tag) % badge_colors.length];
      tag_node.classList.add(badge_color);
      (<HTMLDivElement>task_listitem.querySelector(".widget-heading")).appendChild(tag_a);
      tag_a.addEventListener("click", function (){
        addTaskFilter({
          "type": "tag",
          "value": tag
        },updateTaskList);
      });
    }
  }
  if (task.annotations) {
    for ( let i in task.annotations ){
      let annotation = task.annotations[i];
      let annotation_node: HTMLDivElement =
        <HTMLDivElement>(<Element>(<HTMLTemplateElement>document.getElementById('taskpill_template')).content.cloneNode(true)).querySelector(".badge");
      let icon = document.createElement("i");
      icon.classList.add("fa");
      annotation_node.appendChild(icon);

      const isUrl = function(text){
        let urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.match(urlRegex);
      }
      if ( isUrl(annotation) ){
        annotation_node.classList.add("badge-primary");
        icon.classList.add("fa-link");
        let a = document.createElement("a");
        a.href=annotation;
        a.target="_blank";
        a.appendChild(annotation_node);
        (<HTMLDivElement>task_listitem.querySelector(".widget-subheading")).appendChild(a);
      } else {
        annotation_node.classList.add("badge-info");
        annotation_node.setAttribute("data-toggle","tooltip");
        annotation_node.setAttribute("data-placement","bottom");
        annotation_node.setAttribute("title",annotation);
        (<any>$(annotation_node)).tooltip();
        icon.classList.add("fa-sticky-note");
        (<HTMLDivElement>task_listitem.querySelector(".widget-subheading")).appendChild(annotation_node);
      }
    }
  }
  if (task.priority) {
    let priority_to_bg_map = {
      "H":"bg-danger",
      "M":"bg-warning",
      "L":"bg-secondary"
    }
    let bg_color_class = priority_to_bg_map[task.priority] || "bg-info";
    (<HTMLDivElement>task_listitem.querySelector(".priority-indicator")).classList.add(bg_color_class);
  }

  if (task.urgency || task.urgency == 0) {
    let color = getTaskUrgencyColor(task.urgency);
    if (color) {
      (<HTMLDivElement>task_listitem.querySelector(".urgency-indicator")).style.backgroundColor = color;
    }
  }

  let taskdonebutton = <HTMLButtonElement>task_listitem.querySelector(".task-done-button");
  taskdonebutton.addEventListener("click", function() {
    taskdonebutton.setAttribute("disabled","true");
    heading.classList.add("text-decoration-line-through");
		markTaskAsDone(task,task_listitem, function(){
      taskdonebutton.removeAttribute("disabled");
      heading.classList.remove("text-decoration-line-through");
    });
  });

  let taskstartbutton = <HTMLButtonElement>task_listitem.querySelector(".task-start-button");
  let taskstarticon = <HTMLElement>taskstartbutton.querySelector(".task-start-icon");
  function setStartedButton(){
    taskstartbutton.classList.remove("btn-outline-warning");
    taskstartbutton.classList.add("btn-outline-secondary");
    taskstarticon.classList.remove("fa-play");
    taskstarticon.classList.add("fa-stop");
  }
  function setStoppedButton(){
    taskstartbutton.classList.remove("btn-outline-secondary");
    taskstartbutton.classList.add("btn-outline-warning");
    taskstarticon.classList.remove("fa-stop");
    taskstarticon.classList.add("fa-play");
  }
  if ( task.start ){
    setStartedButton();
  } else {
    setStoppedButton();
  }
  taskstartbutton.addEventListener("click", function() {
    let startstop=(task.start)? "stop" : "start";
    apiCall({
      "endpoint": 'https://inthe.am/api/v2/tasks/'+ task.id + '/' + startstop+ "/",
      "method": "POST",
      "onsuccess": updateTaskList,
      "onfailure": function() {
        console.log("Failed to mark task as " + startstop + ": " + task.id);
      }
    });
  });

  return task_listitem;
}

function apiCall(options){
	chrome.storage.sync.get('intheamapikey',function(items){
		let apikey = items['intheamapikey'];
		if (apikey) {
			// Send the API call to mark the task as Done
			fetch(options['endpoint'] ,{
				'method': options['method'],
				'headers': $.extend({},options['headers'],{
					'Authorization': "Token ".concat(apikey)
				})
			})
			.then( response => {
        if ( response.ok ) {
          options['onsuccess']();
        } else {
          options['onfailure']();
        }
      }, 
			reason => {
        options['onfailure']();
      });
		} else {
			console.log("API key has to be set in the extension options.");
      options['onfailure']();
		}
	});
}

function markTaskAsDone(task, node, onfailure) {
	chrome.storage.sync.get('intheamapikey',function(items){
		let apikey = items['intheamapikey'];
		if (apikey) {
			// Send the API call to mark the task as Done
			fetch('https://inthe.am/api/v2/tasks/'+ task.id + '/' ,{
				'method':'DELETE',
				'headers': {
					'Authorization': "Token ".concat(apikey)
				}
			})
			.then( response => {
        if ( response.ok ) {
          console.log("Marked task as done in server: " + task.id)
          // Update the tasklist to remove it from the list
          chrome.storage.local.get('tasklist',function(items){
            let tasklist = items['tasklist'];
            tasklist = tasklist.filter( t => t.id !== task.id );
            chrome.storage.local.set({'tasklist': tasklist}, function(){
              console.log("Removed task from tasklist" + task.id );
              $(node).slideUp("fast", function () {
                console.log("Removed task from ui" + task.id);
              });
            });
          });
        } else {
          console.log("Failed to update the task in the server: " + task.id + ". Response:" + response );
          onfailure();
        }
      }, 
			reason => {
        console.log("Failed to update the task in the server: " + task.id + ". Reason:" + reason ) 
        onfailure();
      });
		} else {
			console.log("API key has to be set in the extension options.");
      onfailure();
		}
	});
}

let addLinkCheckbox = <HTMLInputElement>document.getElementById("add-link-checkbox");

addLinkCheckbox.addEventListener("change", function(){
  if (addLinkCheckbox.checked) {
    // Set link icon
    addLinkCheckbox.classList.add("text-primary");
    addLinkCheckbox.classList.remove("text-secondary");
  } else {
    addLinkCheckbox.classList.add("text-secondary");
    addLinkCheckbox.classList.remove("text-primary");
  }
  chrome.storage.local.set({"add-link-checkbox":addLinkCheckbox.checked});
});
chrome.storage.local.get("add-link-checkbox",function(items){
  let checked = items["add-link-checkbox"];
  if ( checked ){
    addLinkCheckbox.click();
  }
});

let addFilterCheckbox = <HTMLInputElement>document.getElementById("add-filter-checkbox");

addFilterCheckbox.addEventListener("change", function(){
  if (addFilterCheckbox.checked) {
    // Set link icon
    addFilterCheckbox.classList.add("text-primary");
    addFilterCheckbox.classList.remove("text-secondary");
  } else {
    addFilterCheckbox.classList.add("text-secondary");
    addFilterCheckbox.classList.remove("text-primary");
  }
  chrome.storage.local.set({"add-filter-checkbox":addFilterCheckbox.checked});
});
chrome.storage.local.get("add-filter-checkbox",function(items){
  let checked = items["add-filter-checkbox"];
  if ( checked ){
    addFilterCheckbox.click();
  }
});

export async function submitFormAction(e) {
  return new Promise( resolve => {
    e.preventDefault(); // prevents the page from refreshing on submit.

    chrome.storage.sync.get('intheamapikey', async function (items){
      let apikey = items['intheamapikey'];
      if (apikey) {
        // Disable the add button to avoid repeated submissions
        let addbutton = <HTMLInputElement>document.getElementById('addtask');
        let description_textbox = <HTMLInputElement>document.getElementById('taskdescription');
        addbutton.setAttribute("disabled","true");
        description_textbox.setAttribute("disabled","true");
        const reEnableTaskAdd = function (){
          addbutton.removeAttribute("disabled");
          description_textbox.removeAttribute("disabled");
          description_textbox.value='';
        }
        let description = description_textbox.value;
        let command = parseDescription(description);
        let newtask = command['task'];
        
        if (command['command'] == 'filter' ){
          for (let key in newtask ){
            let promises : Promise<string>[] = [];
            switch(key){
              case "project":
                promises.push(addTaskFilter({
                  'type':'project',
                  'value':newtask[key]
                }));
                break;
              case "tags":
                for (let i in newtask[key] ) {
                  promises.push(addTaskFilter({
                    'type':'tag',
                    'value':newtask[key][i]
                  }));
                }
                break;
              case "description":
                promises.push(addTaskFilter({
                  'type':'description',
                  'value':newtask[key]
                }));
                break;
              default:
            }
            await Promise.all(promises);
            reEnableTaskAdd();
            let msg = 'Applied filters: ' + JSON.stringify(command);
            console.log(msg);
            await updateTaskList();
            resolve('msg');
          }
        }
        if (command['command'] == 'add' ){
          // If add an additional annotation with the active url in case the add
          // link checkbox is checked.
          const withCurrentActiveTabUrl = function (callback){
            // Get url of the current active tab
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              // since only one tab should be active and in the current window at once
              // the return variable should only have one entry
              let activeTab = tabs[0];
              callback(activeTab.url);
            });
          }
          const withTaskFilters = function (callback){
            chrome.storage.local.get('taskfilters',function(items){
              let taskfilters = items['taskfilters'];
              if (! taskfilters) {
                taskfilters = [];
              }
              callback(taskfilters);
            });
          }
          const checkTaskFiltersBeforeSendingApiCall = function (){
            if (addFilterCheckbox.checked){
              withTaskFilters(function(taskfilters){
                // Use the last project in the filters list, and all the tasks,
                // The project will not be overriden if it is explicitly specified.
                for (let i in taskfilters){
                  let tf = taskfilters[i];
                  if (tf['type']=='project'){
                    if (! newtask.project) {
                      newtask.project=tf['value'];
                    }
                  }
                  if (tf['type']=='tag'){
                    if (! newtask.tags) {
                      newtask.tags=[];
                    }
                    // Add task only if not already there
                    if ( newtask.tags.indexOf(tf['value']) === -1 ){
                      newtask.tags.push(tf['value']);
                    }
                  }
                }
                sendApiCall();
              });
            } else {
              sendApiCall();
            }
          }
          const sendApiCall = function (){
            // Send the API call create the task
            fetch('https://inthe.am/api/v2/tasks/' ,{
              'method':'POST',
              'headers': {
                'Authorization': "Token ".concat(apikey),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              'body': JSON.stringify(newtask)
            })
            .then( async response => {
              let msg;
              if ( response.ok ) {
                msg = "Created the task successfully.";
                console.log(msg)
                await updateTaskList();
              } else {
                msg = "Failed to create the task. Response:" + response ;
                console.log(msg);
              }
              reEnableTaskAdd();
              resolve(msg);
            }, 
            reason => {
              let msg = "Failed to create the task. Reason:" + reason ;
              console.log(msg) 
              reEnableTaskAdd();
              resolve(msg);
            });
          }
          if (addLinkCheckbox.checked) {
            withCurrentActiveTabUrl(function(url){
              if (!newtask.annotations){
                newtask.annotations = [];
              }
              newtask.annotations.push(url);
              checkTaskFiltersBeforeSendingApiCall();
            });
          } else {
            checkTaskFiltersBeforeSendingApiCall();
          }
        }
      }
      else {
        let msg = "Please set an api key in the extension option in order to create tasks.";
        console.log(msg);
        resolve(msg);
      }
    });
  });
}
(<HTMLFormElement>document.getElementById('addtaskform')).addEventListener('submit',
                                                                           submitFormAction );

