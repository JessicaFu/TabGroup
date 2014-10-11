var tabGroup;

if (localStorage.tabGroup){
	tabGroup = JSON.parse(localStorage.tabGroup);
}else {
	tabGroup = {"groups":[]}; 
}
var tabArray = tabGroup.groups;

var mainDiv, body;
window.onload = init;

function init(){
	mainDiv = document.getElementById("mainDiv");
	body =document.getElementsByTagName("body")[0];
	var saveBttn = document.getElementById("saveBttn");
	saveBttn.style.lineHeight = window.innerWidth * 0.1 + "px";
	setMouseDownFunc(saveBttn);
	var exitBttn = document.getElementById("editGroupExitBttn");
	setMouseDownFunc(exitBttn);

	fillMainDiv();

	var newBttn=document.getElementById("newBttn")
	setMouseDownFunc(newBttn);
	newBttn.onclick = newGroup;
}

function fillMainDiv(){
	if (tabArray.length==0){
		var msg = document.createElement("div");
		msg.setAttribute("id", "msgDiv");
		msg.innerHTML="You have no tab groups at the moment";
		mainDiv.appendChild(msg);
	}else if(tabArray.length<3){
		mainDiv.style.overflowY="hidden";
	}else {
		mainDiv.onmouseover=function(){
			mainDiv.style.overflowY="visible";
		}
		mainDiv.onmouseleave=function(){
			mainDiv.style.overflowY="hidden";
		}
	}
	for (var i=0; i<tabArray.length; i++){
		createGroupDiv(tabArray[i], i);
	}
}

function setMouseDownFunc(bttn){
	bttn.onmousedown=function(evt){
		evt.stopPropagation();
		bttn.style.backgroundColor="#297ACC";
	}
	bttn.onmouseleave=function(evt){
		evt.stopPropagation();
		bttn.style.backgroundColor="#3399FF";
	}
}

var urlArray;
function newGroup(){
	var overlay = document.getElementById("overlay");
	overlay.style.display = "block";
	var divTitle = document.getElementById("editGroupTitle");
	divTitle.innerHTML="Create New Tab Group";
	var saveBttn = document.getElementById("saveBttn");
	var exitBttn = document.getElementById("editGroupExitBttn");
	var getTabsBttn = document.getElementById("getTabsBttn");
	var addUrl = document.getElementById("addUrl");

	urlArray = [];
	getTabsBttn.onclick=function(){
		chrome.tabs.query({"windowType":"normal", "currentWindow":true}, function(tabs){
			for (var i=0; i<tabs.length; i++){
				urlArray.push(tabs[i].url);
				console.log(tabs[i].url);
			}
		});
	};

	saveBttn.onclick = function(){
		saveGroup();
		updateGroupList();
		clearEditGroupOverlay();
	};

	exitBttn.onclick =function(){
		clearEditGroupOverlay();
	};

	addUrl.onclick = function(){
		addUrlField();
	};

	getTabsBttn.onclick = function(){
		chrome.tabs.query({}, function(tabs) { 
			for (var i=0; i<tabs.length; i++){
				addUrlField(tabs[i].url);
			}
		});
	}
}

function editGroup(index){
	var group=tabArray[index];

	var overlay = document.getElementById("overlay");
	overlay.style.display = "block";
	var divTitle = document.getElementById("editGroupTitle");
	divTitle.innerHTML="Edit Tab Group";
	var saveBttn = document.getElementById("saveBttn");
	var exitBttn = document.getElementById("editGroupExitBttn");
	var addUrl = document.getElementById("addUrl");
	var getTabsBttn = document.getElementById("getTabsBttn");

	var titleField = document.getElementById("titleField");
	var descField = document.getElementById("descField");
	titleField.value = group.title;
	descField.value = group.desc;

	for (var i =0; i<group.list.length; i++){
		addUrlField(group.list[i]);
	}

	saveBttn.onclick = function(){
		saveGroup(index);
		updateGroupList();
		clearEditGroupOverlay();
	};

	exitBttn.onclick =function(){
		clearEditGroupOverlay();
	};

	addUrl.onclick = function(){
		addUrlField();
	};

	getTabsBttn.onclick = function(){
		chrome.tabs.query({}, function(tabs) { 
			for (var i=0; i<tabs.length; i++){
				addUrlField(tabs[i].url);
			}
		});
	}
}

function addUrlField (url){
	var urlHolder = document.getElementById("urlHolder");

	function addField (){
		var urlDiv = document.createElement("div");
		urlDiv.setAttribute("class", "urlDiv");
		var urlField = document.createElement("input");
		urlField.setAttribute("class", "urlField");
		if (url){
			urlField.value = url;
		}
		urlField.setAttribute("placeholder", "Ex: https://google.com");
		var deleteUrl = document.createElement("div");
		deleteUrl.innerHTML = "X";
		deleteUrl.setAttribute("class", "deleteUrl");
		deleteUrl.onclick = function (){
			urlDiv.parentNode.removeChild(urlDiv);
		}

		urlDiv.appendChild(urlField);
		urlDiv.appendChild(deleteUrl);
		urlHolder.appendChild(urlDiv);

	}
	addField();
}

function deleteGroup(index){
	tabArray.splice(index, 1);
	tabGroup.groups=tabArray;
	localStorage.tabGroup = JSON.stringify(tabGroup);
	updateGroupList();
}

function saveGroup(index){
	var urlFields = document.getElementsByClassName("urlField");
	var list = [];
	for (var i=0; i<urlFields.length;i++){
		if (urlFields[i].value!==""){
			list.push(urlFields[i].value);
		}
	}
	var titleField = document.getElementById("titleField");
	var descField = document.getElementById("descField");
	var group={
		"title":titleField.value,
		"desc":descField.value,
		"list":list
	};

	if (index!=null){
		tabArray[index]=group;
	}else {
		tabArray.push(group);
	}
	tabGroup.groups=tabArray;
	localStorage.tabGroup = JSON.stringify(tabGroup);
}
function updateGroupList(){
	body.removeChild(mainDiv);
	mainDiv=document.createElement("div");
	mainDiv.setAttribute("id", "mainDiv");
	fillMainDiv();
	body.appendChild(mainDiv);
}

function clearEditGroupOverlay(){
	var titleField = document.getElementById("titleField");
	var descField = document.getElementById("descField");
	//var urlField = document.getElementById("urlField");
	var overlay = document.getElementById("overlay");
	titleField.value="";
	descField.value="";

	var urlHolder = document.getElementById("urlHolder");
	var editGroupMainDiv = document.getElementById("editGroupMainDiv");
	urlHolder.parentNode.removeChild(urlHolder);

	var newUrlHolder = document.createElement("div");
	newUrlHolder.setAttribute("id", "urlHolder");
	editGroupMainDiv.appendChild(newUrlHolder);
	overlay.style.display="none";
}

function createGroupDiv (group, index){
	var groupDiv = document.createElement("div");
	groupDiv.setAttribute("class", "groupDiv");
	groupDiv.setAttribute("expanded", "false");

	var groupTitleDiv = document.createElement("div");
	groupTitleDiv.setAttribute("class", "groupTitleDiv");

	var title = document.createElement("p");
	title.setAttribute("class", "groupName");
	title.innerHTML=group.title;

	var openBttn = document.createElement("div");
	openBttn.setAttribute("class", "openBttn");
	openBttn.innerHTML="Open";
	setMouseDownFunc(openBttn);
	openBttn.onclick=function(evt){
		evt.stopPropagation();
		var win;
		for (var i=0; i<group.list.length; i++){
			win = window.open(group.list[i], "_blank");
		}
		if (group.list.length>0){
			win.focus;
		}
	};	

	var editBttn = document.createElement("div");
	editBttn.setAttribute("class", "editBttn");
	editBttn.innerHTML="Edit";
	setMouseDownFunc(editBttn);
	editBttn.onclick=function(evt){
		evt.stopPropagation();
		editGroup(index);
	};

	var deleteBttn = document.createElement("div");
	deleteBttn.setAttribute("class", "deleteBttn");
	deleteBttn.innerHTML="X";
	setMouseDownFunc(deleteBttn);
	deleteBttn.onclick=function(evt){
		evt.stopPropagation();
		deleteGroup(index);
	};
	groupTitleDiv.appendChild(title);
	groupTitleDiv.appendChild(deleteBttn);
	groupTitleDiv.appendChild(editBttn);
	groupTitleDiv.appendChild(openBttn);

	var groupDescDiv = document.createElement("div");
	groupDescDiv.setAttribute("class", "groupDescDiv");
	groupDescDiv.innerHTML =group.desc;

	groupDiv.appendChild(groupTitleDiv);
	groupDiv.appendChild(groupDescDiv);
	mainDiv.appendChild(groupDiv);

	groupDiv.onmousedown=function(evt){
		evt.stopPropagation();
		groupDiv.style.backgroundColor="#ADD6FF";
	};
	groupDiv.onmouseleave=function(evt){
		evt.stopPropagation();
		groupDiv.style.backgroundColor="transparent";
	};
	groupDiv.onclick=function(evt){
		evt.stopPropagation();
		if (groupDiv.getAttribute("expanded")=="false"){
			groupDiv.className = "groupDiv groupDivExpand";
			groupDiv.setAttribute("expanded", "true");
		}else {
			groupDiv.className = "groupDiv groupDivMin";
			groupDiv.setAttribute("expanded", "false");
		}
	};
}