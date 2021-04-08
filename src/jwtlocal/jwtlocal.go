package jwtlocal

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("ahddasdhj87wyre92$&86gsdjdsjds.K")

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func SetJWTtoken(uname string) (string, error) {
	expirationTime := time.Now().Add(30 * time.Minute)

	claims := &Claims{
		Username: uname,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		return "", err
	}
	return tokenString, nil
}

func VerifyJWTtoken(tokenString string) (string, error) {
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return "", errors.New("Unauthorised user")
		}
		return "", errors.New("bad Request")
	}
	if !tkn.Valid {
		return "", errors.New("Unauthorised user")
	}
	username := claims.Username
	return username, nil
}
