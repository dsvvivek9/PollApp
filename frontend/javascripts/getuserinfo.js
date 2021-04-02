"use strict";

function closeUserinfoWindow() {
    var mypopup = document.getElementById("userinfo-window");
    mypopup.removeAttribute("style");

    var body = document.getElementById("main-body");
    body.removeAttribute("style");
}
function getuserinfo() {
    var req = new XMLHttpRequest();
    var token = sessionStorage.getItem('token');
    req.open('POST',"/api/userinfo",false);
    if(token != null) {
        req.setRequestHeader("Authorization","Basic "+ token);
    }
    req.send();
    if (req.status != 200) {
        window.location.replace("/index.html");
        return;
    }

    /* creating popup window */
    var mypopup = document.getElementById("userinfo-window");
    mypopup.style.display = "block";
    var body = document.getElementById("main-body");
    body.style.pointerEvents = "none";
    body.style.filter = "blur(8px)";

    /* setting and appending usename node */
    var uname_parent = document.getElementById("userinfo-username");
    while (uname_parent.hasChildNodes()) {
        uname_parent.removeChild(uname_parent.lastChild);
    }
    var uname = document.createElement("span");
    var username = req.getResponseHeader("userinfo");
    uname.appendChild(document.createTextNode(username));
    uname_parent.appendChild(uname);

    /* setting and appending polls created by user */
    var polllist_parent = document.getElementById("userinfo-created-polls");
    while (polllist_parent.hasChildNodes()) {
        polllist_parent.removeChild(polllist_parent.lastChild);
    }
    var polls = req.getResponseHeader("userinfo-polls").split(", ");
    for (let i=0;i<polls.length;i++) {
        var pollcont = document.createElement("div");
        pollcont.className = "userinfo-created-polls-elements";
        var pollname = document.createElement("span");
        pollname.appendChild(document.createTextNode(polls[i]));
        polllist_parent.appendChild(pollcont);
        pollcont.appendChild(pollname);
    }
}