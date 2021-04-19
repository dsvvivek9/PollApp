package main

import (
	"dbfunctions"
	"fmt"
	"jwtlocal"
	"login"
	"net/http"
	"path/filepath"
	"polldata"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

const Apppath = "/Users/akshay.dobariya/Desktop/GO-Tutorials/PollApp"

func main() {
	err := dbfunctions.SetDBdata(Apppath + "/config/Database.yaml")
	if err != nil {
		fmt.Println(err)
		return
	}
	handleRequests()
}

func handleRequests() {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir(filepath.Join(Apppath, "./frontend"))))
	mux.Handle("/api/signup", http.HandlerFunc(usersignup))
	mux.Handle("/api/login", http.HandlerFunc(userlogin))
	mux.Handle("/api/userinfo", authenticatorMiddleware(http.HandlerFunc(getuserinfo)))
	mux.Handle("/api/createpoll", authenticatorMiddleware(http.HandlerFunc(createpoll)))
	mux.Handle("/api/listofpolls", authenticatorMiddleware(http.HandlerFunc(listofpolls)))
	mux.Handle("/api/getpollinfo", authenticatorMiddleware(http.HandlerFunc(getpollinfo)))
	mux.Handle("/api/vote", authenticatorMiddleware(http.HandlerFunc(vote)))
	mux.Handle("/api/getusers", authenticatorMiddleware(http.HandlerFunc(getusers)))
	err := http.ListenAndServeTLS("localhost:10001", "./TLSfiles/localhost.crt", "./TLSfiles/localhost.key", mux)
	fmt.Println(err)
}

func authenticatorMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Executing authenticatorMiddleware")
		myheader := r.Header
		token := myheader.Get("Authorization")
		if token == "" {
			w.Header().Add("error", "Login Required!")
			w.WriteHeader(403)
			return
		} else {
			token = token[6:]
			username, err := jwtlocal.VerifyJWTtoken(token)
			if err != nil {
				fmt.Println(err)
				w.Header().Add("error", err.Error())
				w.WriteHeader(403)
				return
			}
			r.Header.Add("username", username)
		}
		next.ServeHTTP(w, r)
		fmt.Println("Exiting authenticatorMiddleware")
	})
}
func vote(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: vote")
	username := r.Header.Get("username")
	title := r.Header.Get("poll-title")
	option := r.Header.Get("poll-option")

	err := dbfunctions.PollVote(username, title, option)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
	}
	w.WriteHeader(200)
}
func getusers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: getusers")
	username := r.Header.Get("username")
	title := r.Header.Get("poll-title")
	option := r.Header.Get("poll-option")

	pollinst, _, _, err := dbfunctions.FetchPollInfo(title, username)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	_, _, _, polloptions := pollinst.Getinfo()
	users := polloptions[option]
	for _, val := range users {
		w.Header().Add("user-list", val)
	}
	w.WriteHeader(200)
}
func getpollinfo(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: getpollinfo")
	username := r.Header.Get("username")
	title := r.Header.Get("poll-title")

	pollinst, ok, vote, err := dbfunctions.FetchPollInfo(title, username)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	_, _, _, polloptions := pollinst.Getinfo()
	if ok {
		w.Header().Add("user-voted", "true")
		w.Header().Add("user-vote-info", vote)
	} else {
		w.Header().Add("user-voted", "false")
	}
	for key, val := range polloptions {
		if ok {
			entry := fmt.Sprintf("%v:%v", key, len(val))
			w.Header().Add("poll-options", entry)
		} else {
			w.Header().Add("poll-options", key)
		}
	}
}

func listofpolls(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: listofpolls")
	res, err := dbfunctions.ListAllPolls()
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	for _, val := range res {
		w.Header().Add("poll-list", val)
	}
	w.WriteHeader(200)
	return
}
func createpoll(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: createpoll")

	/* setting-up local polldata structure */
	pollTitle := r.Header.Get("poll-title")
	username := r.Header.Get("username")
	optionstring := r.Header.Get("poll-options")
	options := strings.Split(optionstring, ", ")
	myPoll := polldata.Pollinfo{}
	myPoll.Setinfo(pollTitle, username, options)

	/* putting information into the DB */
	ok, err := dbfunctions.CreateNewPoll(myPoll)
	if !ok {
		fmt.Println(err)
		w.Header().Add("error", err.Error())
		w.WriteHeader(403)
	} else if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
	}
	w.WriteHeader(200)
	return
}

func getuserinfo(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: getuserinfo")
	username := r.Header.Get("username")

	/* getting list of polls created by user requesting information */
	poll_list, err := dbfunctions.GetUserInfo(username)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	w.Header().Add("userinfo", username)
	for _, val := range poll_list {
		w.Header().Add("userinfo-polls", val)
	}
	w.WriteHeader(200)
}
func usersignup(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: signup")
	/* getting userdata */
	myheader := r.Header
	temp_u := myheader.Get("username")
	temp_p := myheader.Get("password")

	/* adding userdata to DB */
	userCreds := login.Credentials{}
	userCreds.Setinfo(temp_u, temp_p)
	ok, err := dbfunctions.AddUserData(userCreds)
	if !ok {
		fmt.Println(err)
		w.Header().Add("error", err.Error())
		w.WriteHeader(403)
		return
	} else if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	w.WriteHeader(200)
}

func userlogin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: logindone")
	temp_u := r.Header.Get("username")
	temp_p := r.Header.Get("password")

	/* verifying authenticity of user */
	if temp_u == "" || temp_p == "" {
		w.WriteHeader(401)
		return
	} else {
		usercreds := login.Credentials{}
		usercreds.Setinfo(temp_u, temp_p)
		ok, err := dbfunctions.VerifyUserData(usercreds)
		if !ok {
			fmt.Println(err)
			w.Header().Add("error", err.Error())
			w.WriteHeader(403)
			return
		} else if err != nil {
			fmt.Println(err)
			w.WriteHeader(500)
			return
		}
	}

	/* code to return token for future api requests */
	token, err := jwtlocal.SetJWTtoken(temp_u)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	w.Header().Add("access-token", token)
}
