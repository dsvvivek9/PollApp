package main

import (
	"fmt"
	"time"
)

type mys struct {
	aks int
	dob string
}

func kuchhbhi(a int, d string) (my mys) {
	my = mys{a, d}
	return
}
func main() {
	t := "2021-03-31 15:57:37.568422 +0530 IST m=+0.000159579"
	fmt.Println(time.Now())
	tgiv, _ := time.Parse(time.Now().String(), t)
	dur := time.Since(tgiv)
	mynum := int64(60)
	fmt.Println(mynum)
	fmt.Println(dur.Minutes())
}
