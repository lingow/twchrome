const hashCode=s=>{for(var i=0,h;i<s.length;i++)h=Math.imul(31,h)+s.charCodeAt(i)|0;return h}

function loadTheTaskList() {
  chrome.storage.local.get('tasklist',function(items){
    let tasklist = document.getElementById("tasklist");
    tasklist.innerHTML='';
    let servertasklist = items['tasklist']
    servertasklist.sort( (a,b) => b.urgency - a.urgency);
    for (let i in servertasklist) {
      let task = servertasklist[i];
      let node = taskToHTMLNode(task);
      tasklist.appendChild(node);
    }

  });
}
loadTheTaskList();


function updateTaskList(){
  // This function should actually
  // Get the stored tasklist
  // Request the server for the new tasklist
  // Get the differences
  // Update the ui to reflect the differences
  syncIntheAm(function() { location.reload();}); // for the lazy
}

function taskToHTMLNode(task){
  let task_listitem = document.getElementById('taskentry_template').content.cloneNode(true).querySelector('.list-group-item');
  let heading = task_listitem.querySelector(".widget-heading");
  heading.appendChild(document.createTextNode(task.description));

  let link = task_listitem.querySelector(".task-link");
  link.title = task.description;
  link.href = "https://inthe.am/tasks/" + task.id;

  if (task.project) {
    task_listitem.querySelector(".widget-subheading").appendChild(document.createTextNode(task.project));
  }
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
  if (task.tags) {
    for ( let i in task.tags ){
      let tag = task.tags[i];
      let tag_node = document.getElementById('tasktag_template').content.cloneNode(true).querySelector(".badge");
      tag_node.appendChild(document.createTextNode(tag));
      let badge_color=badge_colors[hashCode(tag) % badge_colors.length];
      tag_node.classList.add(badge_color);
      task_listitem.querySelector(".widget-heading").appendChild(tag_node);
    }
  }
  if (task.annotations) {
    for ( let i in task.annotations ){
      let annotation = task.annotations[i];
      let annotation_node = document.getElementById('taskpill_template').content.cloneNode(true).querySelector(".badge");
      let icon = document.createElement("i");
      icon.classList.add("fa");
      annotation_node.appendChild(icon);

      function isUrl(text){
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
        task_listitem.querySelector(".widget-subheading").appendChild(a);
      } else {
        annotation_node.classList.add("badge-info");
        annotation_node.setAttribute("data-toggle","tooltip");
        annotation_node.setAttribute("data-placement","bottom");
        annotation_node.setAttribute("title",annotation);
        $(annotation_node).tooltip();
        icon.classList.add("fa-sticky-note");
        task_listitem.querySelector(".widget-subheading").appendChild(annotation_node);
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
    task_listitem.querySelector(".priority-indicator").classList.add(bg_color_class);
  }

  if (task.urgency) {
    for(let b in urgencybuckets) {
      if (urgencybuckets[b].urgency < task.urgency ) {
        task_listitem.querySelector(".urgency-indicator").style.backgroundColor = urgencybuckets[b].color;
        break;
      }
    }
  }

  let taskdonebutton = task_listitem.querySelector(".task-done-button");
  taskdonebutton.addEventListener("click", function() {
    taskdonebutton.setAttribute("disabled",true);
    heading.classList.add("text-decoration-line-through");
		markTaskAsDone(task,task_listitem, function(){
      taskdonebutton.removeAttribute("disabled");
      heading.classList.remove("text-decoration-line-through");
    });
  });

  let taskstartbutton = task_listitem.querySelector(".task-start-button");
  let taskstarticon = taskstartbutton.querySelector(".task-start-icon");
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

document.getElementById('addtaskform').addEventListener('submit', function(e) {
  e.preventDefault(); // prevents the page from refreshing on submit.

  chrome.storage.sync.get('intheamapikey',function (items){
    let apikey = items['intheamapikey'];
    if (apikey) {
      // Disable the add button to avoid repeated submissions
      let addbutton = document.getElementById('addtask');
      let description_textbox = document.getElementById('taskdescription');
      addbutton.setAttribute("disabled",true);
      description_textbox.setAttribute("disabled",true);
      function reEnableTaskAdd(){
        addbutton.removeAttribute("disabled");
        description_textbox.removeAttribute("disabled");
        description_textbox.value='';
      }
      let description = description_textbox.value;
      let newtask = parseDescription(description);
      
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
			.then( response => {
        if ( response.ok ) {
          console.log("Created the task successfully.")
          syncIntheAm(loadTheTaskList);
        } else {
          console.log("Failed to create the task. Response:" + response );
        }
        reEnableTaskAdd();
      }, 
			reason => {
        console.log("Failed to create the task. Reason:" + reason ) 
        reEnableTaskAdd();
      });
    }
    else {
      console.log("Please set an api key in the extension option in order to create tasks.");
    }
  });
})

function parseDescription(description){
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
  let pure_description = [];

  let newtask = {};
  let words = description.split(" ");
  for (let i in words){
    let word = words[i];
    let m = []; 
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
