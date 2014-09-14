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
		bttn.style.backgroundColor="#FFFF66";
	}
	bttn.onmouseleave=function(evt){
		evt.stopPropagation();
		bttn.style.backgroundColor="transparent";
	}
}

function newGroup(){
	var overlay = document.getElementById("overlay");
	overlay.style.display = "block";
	var divTitle = document.getElementById("editGroupTitle");
	divTitle.innerHTML="Create New Tab Group";
	var saveBttn = document.getElementById("saveBttn");
	var exitBttn = document.getElementById("editGroupExitBttn");
	saveBttn.onclick = function(){
		saveGroup();
		updateGroupList();
		clearEditGroupOverlay();
	};

	exitBttn.onclick =function(){
		clearEditGroupOverlay();
	};
}

function editGroup(index){
	var group=tabArray[index];

	var overlay = document.getElementById("overlay");
	overlay.style.display = "block";
	var divTitle = document.getElementById("editGroupTitle");
	divTitle.innerHTML="Edit Tab Group";
	var saveBttn = document.getElementById("saveBttn");
	var exitBttn = document.getElementById("editGroupExitBttn");

	var titleField = document.getElementById("titleField");
	var descField = document.getElementById("descField");
	var urlField = document.getElementById("urlField");

	titleField.value = group.title;
	descField.value = group.desc;
	urlField.value = group.list;

	saveBttn.onclick = function(){
		if (urlField.value!==""){
			var group={
				"title":titleField.value,
				"desc":descField.value,
				"list":urlField.value
			};

			tabArray[index]=group;
			tabGroup.groups=tabArray;
			localStorage.tabGroup = JSON.stringify(tabGroup);
		}
		updateGroupList();
		clearEditGroupOverlay();
	};

	exitBttn.onclick =function(){
		clearEditGroupOverlay();
	};

}

function deleteGroup(index){
	tabArray.splice(index, 1);
	tabGroup.groups=tabArray;
	localStorage.tabGroup = JSON.stringify(tabGroup);
	updateGroupList();
}

function saveGroup(){
	var titleField = document.getElementById("titleField");
	var descField = document.getElementById("descField");
	var urlField = document.getElementById("urlField");

	if (urlField.value!==""){
		var group={
			"title":titleField.value,
			"desc":descField.value,
			"list":urlField.value
		};
		tabArray.push(group);
		tabGroup.groups=tabArray;
		localStorage.tabGroup = JSON.stringify(tabGroup);
	}
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
	var urlField = document.getElementById("urlField");
	var overlay = document.getElementById("overlay");
	titleField.value="";
	descField.value="";
	urlField.value="";
	overlay.style.display="none";
}

function createGroupDiv (group, index){
	var groupDiv = document.createElement("div");
	groupDiv.setAttribute("class", "groupDiv");
	var groupTitleDiv = document.createElement("div");
	groupTitleDiv.setAttribute("class", "groupTitleDiv");

	var title = document.createElement("p");
	title.setAttribute("class", "groupName");
	title.innerHTML=group.title;
	var addBttn = document.createElement("div");
	addBttn.setAttribute("class", "addBttn");
	addBttn.innerHTML="+";
	setMouseDownFunc(addBttn);
	addBttn.onclick=function(evt){
		evt.stopPropagation();
		editGroup(index);
	};

	var deleteBttn = document.createElement("div");
	deleteBttn.setAttribute("class", "deleteBttn");
	deleteBttn.innerHTML="-";
	setMouseDownFunc(deleteBttn);
	deleteBttn.onclick=function(evt){
		evt.stopPropagation();
		deleteGroup(index);
	};
	groupTitleDiv.appendChild(title);
	groupTitleDiv.appendChild(addBttn);
	groupTitleDiv.appendChild(deleteBttn);

	var groupDescDiv = document.createElement("div");
	groupDescDiv.setAttribute("class", "groupDescDiv");
	groupDescDiv.innerHTML =group.desc;

	groupDiv.appendChild(groupTitleDiv);
	groupDiv.appendChild(groupDescDiv);
	mainDiv.appendChild(groupDiv);

	setMouseDownFunc(groupDiv);
	groupDiv.onclick=function(){
		var list = group.list.split(';');
		var win;
		for (var i=0; i<list.length; i++){
			win = window.open(list[i], "_blank");
		}
		if (list.length>0){
			win.focus;
		}
	};	
}