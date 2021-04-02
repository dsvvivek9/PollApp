package login

import (
	"errors"
)

type Credentials struct {
	username string
	password string
}

func (C *Credentials) Setinfo(uname, pass string) (err error) {
	if len(uname) >= 8 && len(pass) >= 8 {
		C.username = uname
		C.password = pass
		err = nil
	} else {
		err = errors.New("Username or Password are too short!")
	}
	return
}

func (C *Credentials) Getinfo() (uname, pass string) {
	uname = C.username
	pass = C.password
	return
}
