"use strict";
function checkForLogin(){
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
}
function opensignupwindow() {
    var cont = document.getElementById("signup-window");
    cont.style.display = "block";

    cont = document.getElementById("home-body");
    cont.style.pointerEvents = "none";
    cont.style.filter = "blur(8px)";
}

function closesignupwindow() {
    var cont = document.getElementById("signup-window"); 
    cont.removeAttribute('style')

    cont = document.getElementById("home-body");
    cont.removeAttribute('style');
}
function login() {
    var temp_u = document.getElementById("username").value;
    var temp_p = document.getElementById("password").value;
    document.getElementById("username").removeAttribute("value");
    document.getElementById("password").removeAttribute("value");
    
    var req = new XMLHttpRequest();
    req.open('POST',"/api/login",false);
    req.setRequestHeader("username",temp_u);
    req.setRequestHeader("password",temp_p);
    req.send();
    
    var error;
    if (req.status == 500) {
        error = "Internal Server Error!";
    } else if (req.status == 403) {
        error = req.getResponseHeader("error");
    } else if (req.status == 401){
        error = "Insufficient userinfo!";
    } else {
        try {sessionStorage.removeItem('token');}
        catch {console.log("First time setting up token");}
        var token = req.getResponseHeader("access-token");
        sessionStorage.setItem('token', token);
        window.location.href = "/main.html";
        return;
    }
    var msg = document.getElementById("login-signup-error");
    msg.style="display: block;"
    while (msg.hasChildNodes()) {
        msg.removeChild(msg.lastChild);
    }
    var temp = document.createElement("span");
    temp.appendChild(document.createTextNode(error));
    msg.appendChild(temp);
}

function signup() {
    var temp_u = document.getElementById("newusername").value;
    var temp_p = document.getElementById("newpassword").value;
    document.getElementById("newusername").removeAttribute("value");
    document.getElementById("newpassword").removeAttribute("value");

    var req = new XMLHttpRequest();
    req.open('POST',"/api/signup",false);
    req.setRequestHeader("username",temp_u);
    req.setRequestHeader("password",temp_p);
    req.send();
    closesignupwindow();
    var error;
    if (req.status == 500) {
        error = "Internal Server Error!";
    } else if (req.status == 403) {
        error = req.getResponseHeader("error");
    } else if (req.status == 401){
        error = "Insufficient userinfo!";
    } else {
        var msg = document.getElementById("login-signup-error");
        msg.style="display: block;"
        while (msg.hasChildNodes()) {
            msg.removeChild(msg.lastChild);
        }
        var temp = document.createElement("span");
        temp.appendChild(document.createTextNode("Signup Success! please login now"));
        temp.style="color: green;";
        msg.appendChild(temp);
        return;
    }
    var msg = document.getElementById("login-signup-error");
    msg.style="display: block;"
    while (msg.hasChildNodes()) {
        msg.removeChild(msg.lastChild);
    }
    var temp = document.createElement("span");
    temp.appendChild(document.createTextNode(error));
    msg.appendChild(temp); 
}