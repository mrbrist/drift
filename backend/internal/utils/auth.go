package utils

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type GoogleClaims struct {
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	FirstName     string `json:"given_name"`
	LastName      string `json:"family_name"`
	jwt.RegisteredClaims
}

type TokenType string

const (
	TokenTypeAccess TokenType = "drift-access"
)

func ValidateGoogleJWT(tokenString, clientId string) (*GoogleClaims, error) {
	claims := &GoogleClaims{}

	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			kid, ok := token.Header["kid"].(string)
			if !ok {
				return nil, errors.New("missing kid header")
			}

			pem, err := getGooglePublicKey(kid)
			if err != nil {
				return nil, err
			}

			return jwt.ParseRSAPublicKeyFromPEM([]byte(pem))
		},
		jwt.WithValidMethods([]string{jwt.SigningMethodRS256.Name}),
	)

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid JWT")
	}

	// ---- ISSUER CHECK ----
	issuer, err := claims.GetIssuer()
	if err != nil {
		return nil, err
	}

	if issuer != "accounts.google.com" && issuer != "https://accounts.google.com" {
		return nil, errors.New("iss is invalid")
	}

	// ---- AUDIENCE CHECK ----
	audiences, err := claims.GetAudience()
	if err != nil {
		return nil, err
	}

	validAud := false
	for _, aud := range audiences {
		if aud == clientId {
			validAud = true
			break
		}
	}

	if !validAud {
		return nil, errors.New("aud is invalid")
	}

	// ---- EXPIRATION CHECK ----
	expiresAt, err := claims.GetExpirationTime()
	if err != nil {
		return nil, err
	}

	if expiresAt == nil || expiresAt.Time.Before(time.Now().UTC()) {
		return nil, errors.New("JWT is expired")
	}

	// fmt.Println(claims)

	return claims, nil
}

func getGooglePublicKey(keyID string) (string, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v1/certs")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	keys := map[string]string{}
	if err := json.Unmarshal(data, &keys); err != nil {
		return "", err
	}

	key, ok := keys[keyID]
	if !ok {
		return "", errors.New("key not found")
	}

	return key, nil
}

func MakeJWT(
	email string,
	tokenSecret string,
) (string, error) {
	signingKey := []byte(tokenSecret)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    string(TokenTypeAccess),
		IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		Subject:   email,
	})
	return token.SignedString(signingKey)
}
