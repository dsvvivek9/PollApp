package dbfunctions

import (
	"crypto/md5"
	"database/sql"
	"errors"
	"fmt"
	"io/ioutil"
	"login"
	"polldata"

	_ "github.com/go-sql-driver/mysql"
	"gopkg.in/yaml.v2"
)

type dbdata struct {
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	DBname   string `yaml:"dbname"`
}

var dbDataInstance dbdata

func SetDBdata(filename string) error {
	yamlFile, err := ioutil.ReadFile(filename)
	if err != nil {
		return errors.New("Error reading YAML file:" + err.Error())
	}
	err = yaml.Unmarshal(yamlFile, &dbDataInstance)
	if err != nil {
		return errors.New("Error parsing YAML file:" + err.Error())
	}
	return nil
}

func connect2PollAppDB() (db *sql.DB, err error) {
	db, err = sql.Open("mysql", dbDataInstance.Username+":"+dbDataInstance.Password+"@/"+dbDataInstance.DBname)
	return
}

func closeConnection2PollAppDB(db *sql.DB) {
	db.Close()
}

func AddUserData(userCreds login.Credentials) (bool, error) {
	/* return true, nil (success)
	 * return true, err (failed due to internal error)
	 * return false (failed due invalid data)
	 */
	uname, pass := userCreds.Getinfo()
	if len(uname) >= 8 && len(uname) <= 20 && len(pass) >= 8 && len(pass) <= 20 {
		db, err := connect2PollAppDB()
		if err != nil {
			return true, errors.New("Failed - in adding userdata due to " + err.Error())
		}
		defer closeConnection2PollAppDB(db)
		sqlQuery := "INSERT INTO userdata VALUES (\"" + uname + "\",\"" + pass + "\");"
		_, err = db.Query(sqlQuery)
		if err != nil {
			if err.Error()[0:10] == "Error 1062" {
				return false, errors.New("Failed - in adding userdata due to " + "- User Already exists")
			} else {
				return true, errors.New("Failed - in adding userdata due to " + err.Error())
			}
		}
		return true, nil
	} else {
		return false, errors.New("Failed - username and password should be >= 8 and <= 20")
	}
}

func VerifyUserData(userCreds login.Credentials) (bool, error) {
	/* return true, nil (success)
	 * return true, err (failed due to internal error)
	 * return false (failed due invalid data)
	 */
	uname, pass := userCreds.Getinfo()
	if len(uname) >= 8 && len(uname) <= 20 && len(pass) >= 8 && len(pass) <= 20 {
		db, err := connect2PollAppDB()
		if err != nil {
			return true, errors.New("Failed - in verifying user due to " + err.Error())
		}
		defer closeConnection2PollAppDB(db)
		sqlQuery := "SELECT * FROM userdata WHERE username= \"" + uname + "\";"
		row := db.QueryRow(sqlQuery)
		var temp_u, temp_p string
		err = row.Scan(&temp_u, &temp_p)
		switch err {
		case sql.ErrNoRows:
			return false, errors.New("User doesn't exist, please signup!")
		case nil:
			if temp_p == pass {
				return true, nil
			} else {
				return false, errors.New("Wrong Password!")
			}
		default:
			return true, errors.New("Failes in verifying user due to " + err.Error())
		}
	} else {
		return false, errors.New("Failed - Wrong Credentials!")
	}
}
func GetUserInfo(username string) ([]string, error) {
	result := make([]string, 0)
	db, err := connect2PollAppDB()
	if err != nil {
		return result, errors.New("Failed - in getting userinfo due to - " + err.Error())
	}
	defer closeConnection2PollAppDB(db)
	sqlQuery := "SELECT title FROM allpolls WHERE poll_creator=\"" + username + "\";"
	rowobj, err := db.Query(sqlQuery)
	if err != nil {
		return result, errors.New("Failed - in getting userinfo due to - " + err.Error())
	}
	for rowobj.Next() {
		var title string
		rowobj.Scan(&title)
		result = append(result, title)
	}
	return result, nil
}
func CreateNewPoll(p polldata.Pollinfo) (bool, error) {
	/* return true, nil (success)
	 * return true, err (failed due to internal error)
	 * return false, err (failed due to user created error)
	 */
	title, dbname, uname, options := p.Getinfo()
	db, err := connect2PollAppDB()
	if err != nil {
		return true, errors.New("Failed - in Creating poll " + title + "-" + err.Error())
	}
	defer closeConnection2PollAppDB(db)
	/* adding pollinfo into allpolls table*/
	sqlQuery := "INSERT INTO allpolls VALUES (\"POLL_" + dbname + "\",\"" + title + "\",\"" + uname + "\");"
	_, err = db.Query(sqlQuery)
	if err != nil {
		if err.Error()[0:10] == "Error 1062" {
			/* if poll with same title already exists */
			sqlQuery := "SHOW TABLES;"
			rowobj, _ := db.Query(sqlQuery)
			for rowobj.Next() {
				var tablename string
				rowobj.Scan(&tablename)
				if tablename == "POLL_"+dbname {
					/* if poll with same title also have corresponding polltable(POLL_md5hash) */
					return false, errors.New("Failed - in creating poll due to " + "- Poll Already exists")
				}
			}
		} else {
			return true, errors.New("Failed - in creating poll due to " + err.Error())
		}
	}
	/* creating optiontable to store all possible options for particular poll */
	sqlQuery = "CREATE TABLE OPTION_" + dbname + "(optionid int NOT NULL AUTO_INCREMENT, optionname text, PRIMARY KEY(optionid));"
	_, err = db.Query(sqlQuery)
	if err != nil {
		if err.Error()[0:10] == "Error 1050" {
			//donothing
		} else {
			/* if error in creating optiontable(OPTION_md5hash) then delete inserted metadata in allpolls */
			sqlQuery = "DELETE FROM allpolls WHERE pollid=" + "\"POLL_" + dbname + "\";"
			db.Query(sqlQuery)
			return true, errors.New("Failed - in creating poll due to " + err.Error())
		}
	} else {
		for key, _ := range options {
			sqlQuery = "INSERT INTO OPTION_" + dbname + "(optionname)VALUES(\"" + key + "\")"
			fmt.Println(sqlQuery)
			db.Query(sqlQuery)
		}
	}
	/* creating polltable to store voting information */
	sqlQuery = "CREATE TABLE POLL_" + dbname + "(entryid int NOT NULL AUTO_INCREMENT, optionname text, username text, PRIMARY KEY (entryid));"
	_, err = db.Query(sqlQuery)
	if err != nil {
		/* if error in creating polltable(POLL_md5hash) then delete inserted metadata in allpolls and Optiontable(OPTION_md5hash)*/
		sqlQuery = "DELETE FROM allpolls WHERE pollid=" + "\"POLL_" + dbname + "\";"
		db.Query(sqlQuery)
		sqlQuery = "DROP TABLE OPTION_" + dbname + ";"
		db.Query(sqlQuery)
		return true, errors.New("Failed - in creating poll due to " + err.Error())
	} else {
		return true, nil
	}
}

func ListAllPolls() (result []string, err error) {
	db, err := connect2PollAppDB()
	if err != nil {
		err = errors.New("Failed - " + err.Error())
		return
	}
	defer closeConnection2PollAppDB(db)
	sqlQuery := "SELECT title FROM allpolls;"
	rowobj, err := db.Query(sqlQuery)
	if err != nil {
		err = errors.New("Failed - " + err.Error())
		return
	}
	for rowobj.Next() {
		var temp_title string
		rowobj.Scan(&temp_title)
		result = append(result, temp_title)
	}
	return
}

func FetchPollInfo(title, username string) (pollinstance polldata.Pollinfo, ok bool, vote string, err error) {
	ok = false
	vote = ""
	/* return ok = true (user have voted) */
	pollinstance = polldata.Pollinfo{}
	db, err := connect2PollAppDB()
	if err != nil {
		err = errors.New("Failed - poll listing failed due to" + err.Error())
		return
	}
	defer closeConnection2PollAppDB(db)
	md5hash := fmt.Sprintf("%x", md5.Sum([]byte(title)))

	/* getting creator info from allpolls table */
	sqlQuery := "SELECT poll_creator FROM allpolls WHERE pollid=\"POLL_" + md5hash + "\";"
	row := db.QueryRow(sqlQuery)
	var uname string
	err = row.Scan(&uname)
	switch err {
	case sql.ErrNoRows:
		err = errors.New("POll doesn't exist!")
		return
	case nil:
		//do nothing;
	default:
		return
	}

	/* getting pollinfo using md5hash of title */
	sqlQuery = "SELECT optionname FROM OPTION_" + md5hash + ";"
	rowobj, _ := db.Query(sqlQuery)
	options := make([]string, 0)
	for rowobj.Next() {
		var option string
		rowobj.Scan(&option)
		options = append(options, option)
	}

	pollinstance.Setinfo(title, uname, options)

	/* checking if username have voted or not and fetching voter info */
	for _, val := range options {
		sqlQuery = "SELECT username FROM POLL_" + md5hash + " WHERE optionname=\"" + val + "\";"
		rowobj, _ := db.Query(sqlQuery)
		for rowobj.Next() {
			var voter string
			rowobj.Scan(&voter)
			if voter == username {
				ok = true
				vote = val
			}
			pollinstance.SetVoterData(val, voter)
		}
	}
	return
}
func PollVote(username, title, option string) error {
	/* return true, nil (success)
	 * return true, err (failed due to internal error)
	 * return false     (some user created error)
	 */
	db, err := connect2PollAppDB()
	if err != nil {
		return errors.New("Failed - PollVote due to" + err.Error())
	}
	defer closeConnection2PollAppDB(db)
	md5hash := fmt.Sprintf("%x", md5.Sum([]byte(title)))
	/* check if user have voted before or not if yes delete old data */
	sqlQuery := "SELECT entryid FROM POLL_" + md5hash + " WHERE username=\"" + username + "\";"
	row := db.QueryRow(sqlQuery)
	var entryid string
	err = row.Scan(&entryid)
	switch err {
	case sql.ErrNoRows:
		//do nothing;
	case nil:
		sqlQuery = "DELETE FROM POLL_" + md5hash + " WHERE entryid=\"" + entryid + "\";"
		db.Query(sqlQuery)
	default:
		return err
	}

	/* Add new vote information */
	sqlQuery = "INSERT INTO POLL_" + md5hash + " (optionname, username) VALUES (\"" + option + "\",\"" + username + "\");"
	_, err = db.Query(sqlQuery)
	if err != nil {
		return err
	}
	return nil
}
