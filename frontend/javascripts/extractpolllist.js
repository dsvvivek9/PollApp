"use strict";
function showPollError(error){
    var errWindow = document.getElementById("polllist-error");
    while (errWindow.hasChildNodes()){
        errWindow.removeChild(errWindow.lastChild);
    }
    var err = document.createElement("span");
    err.className = "polllist-error-text";
    err.id = "polllist-error-text";
    err.appendChild(document.createTextNode(error));
    errWindow.appendChild(err);
    return;
} 
function voteSelector(option) {
    var curSelectedOption = document.getElementById("selected-option");
    var node;
    if(curSelectedOption != null && curSelectedOption.value == option) {
        /* case of clicking already selected poll */
        return;
    } else if (curSelectedOption == null) {
        /* first time case when nothing selected */
        node = document.getElementById(option);
        node.id="selected-option";
    } else {
        curSelectedOption.id = curSelectedOption.value;
        node = document.getElementById(option);
        node.id = "selected-option"
    }
    return;
}
function pollSelector(title) {
    var curSelectedPoll = document.getElementById("selected-poll");
    var node;
    if (curSelectedPoll != null && curSelectedPoll.value == title){
        /* case of clicking already selected poll */
        return;
    } else if (curSelectedPoll == null) {
        /* first time case when nothing selected */
        node = document.getElementById(title);
        node.id = "selected-poll";
    } else {
        curSelectedPoll.id = curSelectedPoll.value;
        node = document.getElementById(title);
        node.id = "selected-poll";
    }
    getPollInfo(title);
}
function getPollInfo(title) {
    /* code to fetch information about poll selected - node */
    var req = new XMLHttpRequest();
    req.open('POST', '/api/getpollinfo', false);
    var token = sessionStorage.getItem('token');
    if (token != null){
        req.setRequestHeader("Authorization","Basic "+ token);
    }
    req.setRequestHeader("poll-title",title);
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
        showPollError(resErr);
    } else {
        /*setting-up vote button */
        document.getElementById("vote-button").value = title;
        /* setting-up poll title */
        var titleElement = document.createElement("span");
        titleElement.className = "title-content";
        titleElement.appendChild(document.createTextNode(title));
        var titleWindow = document.getElementById("poll-title");
        while(titleWindow.hasChildNodes()){
            titleWindow.removeChild(titleWindow.lastChild);
        }
        titleWindow.appendChild(titleElement);
        /* setting-up options */
        var optionWindow = document.getElementById("poll-option-window");
        while(optionWindow.hasChildNodes()){
            optionWindow.removeChild(optionWindow.lastChild);
        }
        var ok = req.getResponseHeader("user-voted");
        if (ok == "true") {
            var myvote = req.getResponseHeader("user-vote-info");
            var options = req.getResponseHeader("poll-options");
            var tempArray = options.split(", ");
            var option = new Array();
            var counts = new Array();
            for (let i=0;i<tempArray.length;i++){
                var tempStore = tempArray[i].split(":");
                option.push(tempStore[0]);
                counts.push(tempStore[1]);
            }
            for (let i=0;i<tempArray.length;i++){
                /* setting-up poll-elements */
                var pollElem = document.createElement("div");
                pollElem.className = "poll-elements";
                /*setting-up poll-option */
                var pollOpt = document.createElement("div");
                pollOpt.className = "poll-options";
                pollOpt.id=option[i];
                pollOpt.value=option[i];
                pollOpt.addEventListener('click',function(){voteSelector(option[i]);});
                var spanElem = document.createElement("span");
                spanElem.className = "content";
                spanElem.setAttribute("for", option[i]);
                spanElem.appendChild(document.createTextNode(option[i]));
                /* setting-up vote-count */
                var voteCountdiv = document.createElement("div");
                voteCountdiv.className = "poll-options-votes";
                voteCountdiv.addEventListener('click',function(){showListOfUsers(title,option[i]);});
                var voteCountSpan = document.createElement("span");
                voteCountSpan.className = "content";
                voteCountSpan.appendChild(document.createTextNode(counts[i]));

                /* setting user-voted option */
                if( myvote == option[i]) {
                    pollOpt.id = "selected-option";
                }

                /* building final node tree */
                pollOpt.appendChild(spanElem);
                voteCountdiv.appendChild(voteCountSpan);
                pollElem.appendChild(pollOpt);
                pollElem.appendChild(voteCountdiv);
                optionWindow.appendChild(pollElem);
            }
        } else {
            var options = req.getResponseHeader("poll-options");
            var tempArray = options.split(", ");
            var option = new Array();
            for (let i=0;i<tempArray.length;i++){
                option.push(tempArray[i])
            }
            for (let i=0;i<tempArray.length;i++){
                /* setting-up poll-elements */
                var pollElem = document.createElement("div");
                pollElem.className = "poll-elements";
                /*setting-up poll-option */
                var pollOpt = document.createElement("div");
                pollOpt.className = "poll-options";
                pollOpt.id=option[i];
                pollOpt.value=option[i];
                pollOpt.addEventListener('click',function(){voteSelector(option[i]);});
                var spanElem = document.createElement("span");
                spanElem.className = "content";
                spanElem.setAttribute("for", option[i]);
                spanElem.appendChild(document.createTextNode(option[i]));

                /* building final node tree */
                pollOpt.appendChild(spanElem);
                pollElem.appendChild(pollOpt);
                optionWindow.appendChild(pollElem);
                pollOpt.style.gridColumnStart = "1";
                pollOpt.style.gridColumnEnd = "3";
            }
        }
    }
}
function showListOfUsers(title, option){
    var req = new XMLHttpRequest();
    req.open('POST', '/api/getusers', false);
    var token = sessionStorage.getItem('token');
    if (token != null){
        req.setRequestHeader("Authorization","Basic "+ token);
    }
    req.setRequestHeader("poll-title",title);
    req.setRequestHeader("poll-option", option);
    req.send();
    var resErr;
    if(req.status != 200) {
        if(req.status == 500) {
            resErr = "Internal Server Error";
        } else if (req.status == 403) {
            resErr = req.getResponseHeader("error");
        } else {
            resErr = "Error due to Unknown cause!";
        }
        showPollError(resErr);
    } else {
        var userListString = req.getResponseHeader("user-list");
        var userList = userListString.split(", ");
        /* adding userList to userslist popup window */
        var usersListWindow = document.getElementById("userslist-window-inside");
        while(usersListWindow.hasChildNodes()){
            usersListWindow.removeChild(usersListWindow.lastChild);
        }
        for(let i=0;i<userList.length;i++){
            var spanElem = document.createElement("span");
            spanElem.className = "userslist-elements";
            spanElem.appendChild(document.createTextNode(userList[i]));
            usersListWindow.appendChild(spanElem);
        }
        var mainWindow = document.getElementById("userslist-window");
        mainWindow.style.display = "block";

        var mainBody = document.getElementById("main-body");
        mainBody.style.pointerEvents = "none";
        mainBody.style.filter = "blur(8px)";
    }
}
function closeUsersList() {
    var usersListWindow = document.getElementById("userslist-window");
    var mainBody = document.getElementById("main-body");
    usersListWindow.removeAttribute("style");
    mainBody.removeAttribute("style");
}
function fetchPollList() {
    var sideWindow = document.getElementById("sidebar-elements-window");
    while(sideWindow.hasChildNodes()){
        sideWindow.removeChild(sideWindow.lastChild);
    }

    /* code to get list of polls */
    var req = new XMLHttpRequest();
    req.open('POST', '/api/listofpolls', false);
    var token = sessionStorage.getItem('token');
    if (token != null){
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
        showPollError(resErr);
    } else {
        /* code to add polls in the sidebar */
        var pollstring = req.getResponseHeader("poll-list");
        var pollList = pollstring.split(", ");
        for (let i=0;i<pollList.length;i++){
            var tempdiv = document.createElement("div");
            tempdiv.className = "sidebar-elements";
            tempdiv.addEventListener('click',function(){pollSelector(pollList[i]);});
            tempdiv.value=pollList[i];
            tempdiv.id=pollList[i];
            var tempspan = document.createElement("span");
            tempspan.className = "content";
            tempspan.appendChild(document.createTextNode(pollList[i]));
            tempdiv.appendChild(tempspan);
            sideWindow.appendChild(tempdiv);
        }
        pollSelector(pollList[0]);
    }
}
function vote() {
    var title = document.getElementById("vote-button").value;
    var optionElem = document.getElementById("selected-option");
    if(optionElem == null) {
        showPollError("No option Selected!");
        return;
    } else if(title == "") {
        showPollError("No poll to vote for!");
        return;
    }
    var option = optionElem.value;
    /* code to vote for particular */
    var req = new XMLHttpRequest();
    req.open('POST', '/api/vote', false);
    var token = sessionStorage.getItem('token');
    if (token != null){
        req.setRequestHeader("Authorization","Basic "+ token);
    }
    req.setRequestHeader("poll-title",title);
    req.setRequestHeader("poll-option", option);
    req.send();
    var resErr;
    if(req.status != 200) {
        if(req.status == 500) {
            resErr = "Internal Server Error";
        } else if (req.status == 403) {
            resErr = req.getResponseHeader("error");
        } else {
            resErr = "Error due to Unknown cause!";
        }
        showPollError(resErr);
        return;
    }
    getPollInfo(title);
}