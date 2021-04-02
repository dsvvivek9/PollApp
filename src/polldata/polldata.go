package polldata

import (
	"crypto/md5"
	"errors"
	"fmt"
)

type Pollinfo struct {
	title        string
	md5hash      string
	poll_creator string
	options      map[string][]string
}

func (p *Pollinfo) Setinfo(ptitle, uname string, poptions []string) error {
	if len(ptitle) == 0 || len(uname) == 0 || len(poptions) < 1 {
		return errors.New("Failed : polldata is invalid!")
	}
	p.title = ptitle
	p.poll_creator = uname
	p.md5hash = fmt.Sprintf("%x", md5.Sum([]byte(ptitle)))
	p.options = make(map[string][]string)
	for _, val := range poptions {
		myslice := make([]string, 0)
		p.options[val] = myslice
	}
	return nil
}

func (p *Pollinfo) Getinfo() (string, string, string, map[string][]string) {
	return p.title, p.md5hash, p.poll_creator, p.options
}
func (p *Pollinfo) SetVoterData(option, username string) {
	_, ok := p.options[option]
	if ok {
		p.options[option] = append(p.options[option], username)
	}
}
