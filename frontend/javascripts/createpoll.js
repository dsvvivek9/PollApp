"use strict";
function openCreatePollWindow() {
    var createPoll = document.getElementById("createpoll-main-body");
    createPoll.style.display =  "block";

    var mainBody = document.getElementById("main-body");
    mainBody.style.pointerEvents = "none";
    mainBody.style.filter = "blur(8px)";

    var createButton = document.getElementById("createpoll-button");
    createButton.style.display = "none";    
}
function closeCreatePollWindow() {
    var createPoll = document.getElementById("createpoll-main-body");
    createPoll.removeAttribute("style");

    var mainBody = document.getElementById("main-body");
    mainBody.removeAttribute("style");

    var createButton = document.getElementById("createpoll-button");
    createButton.removeAttribute("style");
}
function addOrRemoveOptions() {
    var parent = document.getElementById("createpoll-options");
    var nodes = parent.children;

    var countEmptyNodes = 0;
    for (let i=0;i<nodes.length;i++){
        if(nodes[i].value == "") {
            countEmptyNodes++;
        }
    }
    
    if (countEmptyNodes > 2) {
        var tempStack = document.createElement("div");
        var nodesToBeDeleted = countEmptyNodes - 2;
        while(nodesToBeDeleted > 0) {
            if(parent.lastChild.value == "") {
                parent.removeChild(parent.lastChild);
                nodesToBeDeleted--;
            } else {
                var tempNode = parent.lastChild;
                parent.removeChild(parent.lastChild);
                tempStack.append(tempNode);
            }
        }
        while(tempStack.hasChildNodes()){
            var tempNode = tempStack.lastChild;
            tempStack.removeChild(tempStack.lastChild);
            parent.appendChild(tempNode);
        }
    } else if(countEmptyNodes == 2) {
        return;
    } else if(countEmptyNodes == 1) {
        var temp = document.createElement("input");
        temp.className = "createpoll-options-elements";
        temp.addEventListener('click',function(){addOrRemoveOptions();});
        temp.placeholder = "Type here options you want to add!";
        parent.appendChild(temp);
    } else if(countEmptyNodes == 0) {
        var temp = document.createElement("input");
        temp.className = "createpoll-options-elements";
        temp.addEventListener('click',function(){addOrRemoveOptions();});
        temp.placeholder = "Type here options you want to add!";
        parent.appendChild(temp);

        temp = document.createElement("input");
        temp.className = "createpoll-options-elements";
        temp.addEventListener('click',function(){addOrRemoveOptions();});
        temp.placeholder = "Type here options you want to add!";
        parent.appendChild(temp);
    }
}

function discardChanges() {
    document.getElementById("polltitle").value = "";
    var errWindow = document.getElementById("createpoll-error");
    while (errWindow.hasChildNodes()){
        errWindow.removeChild(errWindow.lastChild);
    }
    var options = document.getElementById("createpoll-options");
    while(options.hasChildNodes()) {
        options.removeChild(options.lastChild);
    }
    addOrRemoveOptions();
    closeCreatePollWindow();
}
// Function to check letters and numbers
function alphanumeric(inputtxt) {
    for (let i=0; i < inputtxt.length ;i++){
        var char1 = inputtxt.charAt(i);
        var cc = char1.charCodeAt(0);
        if ((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123) || (cc == 63) || (cc == 33) || (cc == 32)) {
            return true;
        } else {
            return false;
        }
    }
}
  
function showError(error) {
    var errWindow = document.getElementById("createpoll-error");
    while (errWindow.hasChildNodes()){
        errWindow.removeChild(errWindow.lastChild);
    }
    var err = document.createElement("span");
    err.className = "createpoll-error-text";
    err.id = "createpoll-error-text";
    err.appendChild(document.createTextNode(error));
    errWindow.appendChild(err);
    return;
}
function createNewPoll() {
    /* extracting title */
    var pollTitle = document.getElementById("polltitle").value;
    if(pollTitle == "") {
        showError("Title is mandatory!");
        return;
    } else {
        if(!alphanumeric(pollTitle)) {
            showError("Title should be in Alphanumeric!");
            return;
        }
    }

    /* extracting options */
    var pollOptions = document.getElementById("createpoll-options").children;
    var countFilledNodes = 0;
    var optionArray = new Array();
    for (let i=0; i < pollOptions.length; i++){
        if(pollOptions[i].value != "") {
            countFilledNodes++;
            optionArray.push(pollOptions[i].value);
        }
    }
    if(countFilledNodes < 2) {
        showError("Atleast 2 number of options required to create poll!");
        return;
    } else {
        for(let i=0;i<optionArray.length;i++){
            if(!alphanumeric(optionArray[i])) {
                showError("Each option should be in Alphanumeric!");
                return;
            }
        }
    }

    /* sending information to the server */
    var req = new XMLHttpRequest();
    req.open("POST", "/api/createpoll", false);
    req.setRequestHeader("poll-title", pollTitle);
    for(let i=0;i<optionArray.length;i++) {
        req.setRequestHeader("poll-options",optionArray[i]);
    }
    var token = sessionStorage.getItem('token');
    if(token != null) {
        req.setRequestHeader("Authorization","Basic "+ token);
    }
    req.send();
    var resErr;
    if(req.status != 200){
        if(req.status == 500) {
            resErr = "Internal Server Error";
        } else if (req.status == 403) {
            resErr = req.getResponseHeader("error");
        } else {
            resErr = "Error due to Unknown cause!";
        }
        showError(resErr);
    } else {
        discardChanges();
        fetchPollList();
    }
}