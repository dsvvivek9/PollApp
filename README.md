# PollApp

# go to Application root folder i.e. PollApp

# setting up environment variables
export GOPATH="/PATH/TO/PollApp"
export GO111MODULE="auto"

# setting up Application path
In /src/main/main.go file -> update Apppath="/PATH/TO/PollApp"

# setting up DB (mysql)
CREATE DATABASE PollApp;
USE PollApp
CREATE TABLE userdata (username VARCHAR(20), password VARCHAR(20), PRIMARY KEY (username));
CREATE TABLE allpolls (pollid CHAR(37),title text,poll_creator VARCHAR(20), PRIMARY KEY (pollid));

# setting credentials to access DB from server
1. Apppath/config/Database.yaml -> set username, password and dbname

# changing portnumber and ip 
handleRequests() function -> change 1st parameter your ease(ip:port) in http.ListenAndServeTLS() function call

# go to Application root folder i.e. PollApp to install and run the program
go install main
./bin/main



