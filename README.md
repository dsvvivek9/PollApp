# PollApp

#go to Application root folder i.e. PollApp

#setting up environment variables
export GOPATH="/PATH/TO/PollApp"
export GO111MODULE="auto"

#setting up Application path
In /src/main/main.go file -> update Apppath="/PATH/TO/PollApp"

#setting up DB (mysql)
CREATE DATABASE PollApp;
USE PollApp
CREATE TABLE userdata (username VARCHAR(20), password VARCHAR(20), PRIMARY KEY (username));
CREATE TABLE allpolls (pollid CHAR(37),title text,poll_creator VARCHAR(20), PRIMARY KEY (pollid));

#setting username and password to access DB from server
1. In PollApp/src/dbfunctions/dbfunctions.go file -> inside connect2PollAppDB() function -> change 2nd param of sql.Open("mysql","username:password@/pollapp");
2. In PollApp/src/main/main.go file ->inside main() function -> change 2nd param of sql.Open("mysql","username:password@/pollapp");

#changing portnumber and ip 
handleRequests() function -> change 1st parameter your ease(ip:port) in http.ListenAndServeTLS() function call

#go to Application root folder i.e. PollApp to install and run the program
go install main
./bin/main



