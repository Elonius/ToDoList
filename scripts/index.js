// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
	"use strict";

	document.addEventListener('deviceready', onDeviceReady.bind(this), false);

	function onDeviceReady() {
		// Handle the Cordova pause and resume events
		document.addEventListener('pause', onPause.bind(this), false);
		document.addEventListener('resume', onResume.bind(this), false);

		// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

		// Mapping buttons to variables and functions
		let btnAdd = document.querySelector("#btnAdd");
		btnAdd.addEventListener("click", addTask);
		let btnDelete = document.querySelector("#btnDelete");
		btnDelete.addEventListener("click", deleteTask);
		let btnUp = document.querySelector("#btnUp");
		btnUp.addEventListener("click", goUp);
		let btnDown = document.querySelector("#btnDown");
		btnDown.addEventListener("click", goDown);

		//document.querySelector("#btnClear").addEventListener("click", ClearStorage);

		document.querySelector("#content ul").addEventListener("click", handleClick);
		document.querySelector("#content ul").addEventListener("dblclick", handleDblClick);

		// Disabling buttons on load, except Add button
		btnAdd.classList.add("btnEnable");
		DisableBtns("all");

		// Global variable
		window.storage = window.localStorage;
		window.todoList = [];
		window.index;

		// Setting title of app
		storage.setItem("title", "Shawn's ToDo List");
		let title = storage.getItem("title");
		document.querySelector("#title").innerHTML = title;

		if (localStorage.length === 0) {
			window.localStorage.setItem("todoList", JSON.stringify(todoList));
		}
		window.taskList = JSON.parse(window.localStorage.getItem("todoList"));

		DisplayList();
	};

	function onPause() {
		// TODO: This application has been suspended. Save application state here.
	};
	function onResume() {
		// TODO: This application has been reactivated. Restore application state here.
	};

	function addTask() {
		navigator.notification.prompt(
			'Enter a task',
			onPrompt,
			'Add New Task',
			['Ok', 'Exit'],
		);
		ResetHighlight();
		DisableBtns("all");
	}

	function deleteTask() {
		let liTag = document.querySelectorAll("#content ul li");

		for (let i = 0; i < taskList.length; i++) {
			if (liTag[i].classList.contains("highlight")) {
				taskList.splice(i, 1);
			}
		}
		SaveList();
		DisplayList();
	}

	function onPrompt(results) {
		if (results.input1 !== "") {
			// Adds inputted text into the array as an object
			taskList.push({
				key: results.input1,
				completed: false
			});
			SaveList();
			DisplayList();
		}
	}

	function DisplayList() {
		document.querySelector("#content ul").innerHTML = ""; // Clears list before populating it
		for (let i = 0; i < taskList.length; i++) {
			if (taskList[i].completed == true) {
				document.querySelector("#content ul").innerHTML += "<li class='complete'>" + taskList[i].key + "</span></li>";
			}
			else {
				document.querySelector("#content ul").innerHTML += "<li>" + taskList[i].key + "</li>";
			}
		}
		console.log(localStorage);
		console.log(JSON.parse(localStorage.todoList));
		SaveList();
	}

	// Add highlighting
	function handleClick(e) {
		let target = e.target;
		console.log(e);
		console.log(target);
		ResetHighlight();
		// Added 'if' to fix a bug if you click between two tasks
		if (target.localName === 'li') {
			target.classList.add("highlight"); // Highlight the selected task			
			EnableBtns();
			CheckSiblings(target);
		}
		else {
			DisableBtns("all");
			ResetHighlight();
		}
	}

	function handleDblClick(e) {
		let target = e.target;
		target.classList.toggle("complete");
		let liTag = document.querySelectorAll("#content ul li");

		for (var i = 0, count = liTag.length; i < count; i++) {
			if (liTag[i].classList.contains("complete")) {
				taskList[i].completed = true;
			}
			else {
				taskList[i].completed = false;
			}
		}

		SaveList();
	}

	function ResetHighlight() {
		let liTag = document.querySelectorAll("#content ul li");
		// Remove highlight from all tasks
		for (let i = 0, count = liTag.length; i < count; i++) {
			liTag[i].classList.remove("highlight");
		}
	}

	// TODO: Combine goUp/goDown functions into one function
	function goUp() {
		let liTag = document.querySelectorAll("#content ul li");

		for (let i = 0, count = liTag.length; i < count; i++) {
			if (liTag[i].classList.contains("highlight")) {
				// Swaps highlighted task with task above it
				[taskList[i - 1], taskList[i]] = [taskList[i], taskList[i - 1]];
				if (liTag[i].previousElementSibling == null) {
					btnUp.setAttribute("disabled", "disabled");
					btnUp.classList.remove("btnEnable");
				}
			}
		}
		SaveList();
		ResetHighlight();
		DisableBtns("all");
		DisplayList();
	}

	function goDown() {
		let liTag = document.querySelectorAll("#content ul li");

		for (var i = 0, count = liTag.length; i < count; i++) {
			if (liTag[i].classList.contains("highlight")) {
				// Swaps highlighted task with task below it
				[taskList[i + 1], taskList[i]] = [taskList[i], taskList[i + 1]];
				if (liTag[i].nextElementSibling == null) {
					btnDown.setAttribute("disabled", "disabled");
					btnDown.classList.remove("btnEnable");
				}
			}
		}
		SaveList();
		ResetHighlight();
		DisableBtns("all");
		DisplayList();
	}

	// TODO: Make this a loop
	function DisableBtns(word) {
		if (word === "all") {
			btnDelete.setAttribute("disabled", "disabled");
			btnDelete.classList.remove("btnEnable");
			btnUp.setAttribute("disabled", "disabled");
			btnUp.classList.remove("btnEnable");
			btnDown.setAttribute("disabled", "disabled");
			btnDown.classList.remove("btnEnable");
		}
	}

	function EnableBtns() {
		let button = document.querySelectorAll("button")
		button.forEach(function (element) {
			element.removeAttribute("disabled");
			element.classList.add("btnEnable");
		});
	}

	//function ClearStorage() {
	//	localStorage.clear();
	//}

	function SaveList() {
		window.localStorage.setItem("todoList", JSON.stringify(taskList));
	}

	// Checks if highlighted task should disable goUp/goDown buttons
	function CheckSiblings(target) {
		if (target.previousElementSibling == null) {
			btnUp.setAttribute("disabled", "disabled");
			btnUp.classList.remove("btnEnable");
		}
		if (target.nextElementSibling == null) {
			btnDown.setAttribute("disabled", "disabled");
			btnDown.classList.remove("btnEnable");
		}
	}
})();