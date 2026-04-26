package main

import (
	"backend/endpoints"
	"backend/middleware"
	"backend/state"
	"backend/users"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	_ "github.com/lib/pq"
	_ "golang.org/x/crypto/argon2"
)


func main() {
	web_hostname := os.Getenv("NEXT_PUBLIC_WEB_HOSTNAME")
	web_port := os.Getenv("NEXT_PUBLIC_WEB_PORT")
	
	database_hostname := os.Getenv("DATABASE_HOSTNAME")
	database_port := os.Getenv("DATABASE_PORT")
	
	database_user := os.Getenv("POSTGRES_USER")
	database_password := os.Getenv("POSTGRES_PASSWORD")
	database_name := os.Getenv("POSTGRES_DB")
	
	// the format is username:password@tcp(host:port)/dbname
	var err error;
	state.Database, err = sql.Open("postgres", fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s sslmode=disable",
		database_user,
		database_password,
		database_hostname,
		database_port,
		database_name,
	));
	
	if err != nil {
		fmt.Printf("Cannot connect to database: %s\n", err)
		return;
	}
	
	fmt.Println("Connected to database")
	tryMakeFirstUser()
	fmt.Println("Initialized!")
	
	router := gin.Default()
	router.SetTrustedProxies(nil)
	
	router.Use(cors.New(cors.Config {
		AllowAllOrigins: false,
		AllowMethods: []string { "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", },
		AllowHeaders: []string { "Authorization" },
		AllowOrigins: []string {
			"http://" + web_hostname,
			"http://" + web_hostname + ":" + web_port + "",
		},
	}))
	
	frozenChecked := router.Group("", middleware.AuthCheck())
	frozenChecked.GET("/v1/me", endpoints.Me)
	frozenChecked.GET("/v1/users/:id/profile", endpoints.FindUser)
	frozenChecked.POST("/v1/users/:id/freeze", endpoints.FreezeUser)
	frozenChecked.POST("/v1/users/:id/unfreeze", endpoints.UnfreezeUser)
	frozenChecked.GET("/v1/users/:id/allowed_changes", endpoints.AllowedUserChanges)
	frozenChecked.PATCH("/v1/users/:id/profile", endpoints.ModifyUser)
	frozenChecked.DELETE("/v1/users/:id", endpoints.DeleteUser)
	frozenChecked.GET("/v1/users/list", endpoints.ListUsers)
	frozenChecked.POST("/v1/create_user", endpoints.CreateUser)
	frozenChecked.POST("/v1/logout", endpoints.Logout)
	
	router.POST("/v1/login", endpoints.Login)
	
	router.Run()
}

func tryMakeFirstUser() bool {
	// ignore any data, only want to know if there any records or not
	var ignored string
	err := state.Database.QueryRow("SELECT 1 FROM Users LIMIT 1").Scan(&ignored)
	if err != nil && err != sql.ErrNoRows {
		fmt.Printf("Error, cannot check database if there any user: %s\n", err.Error())
		return false
	}
	
	if err != sql.ErrNoRows {
		fmt.Println("There is already an user, won't do anything")
		return true
	}
	
	fmt.Println("There no user, creating initial admin account, this password will only appear ONCE!")
	passwordUnencoded := make([]byte, 20)
	_, err = rand.Read(passwordUnencoded)
	if err != nil {
		fmt.Printf("Cannot generate password for initial account: %s\n", err.Error())
		return false
	}
	
	password := hex.EncodeToString(passwordUnencoded)
	userInfo := users.CreateInfo {
		Username: "admin",
		FullName: "The Administrator",
		Password: password,
		DisplayName: "Administrator",
		Role: users.RoleAdmin,
	}
	
	err = users.CreateUser(&userInfo)
	
	if err != nil {
		fmt.Printf("Cannot create initial user: %s\n", err)
		return false;
	}
	
	fmt.Println("Initial user created")
	fmt.Printf("Username: %s\n", userInfo.Username)
	fmt.Printf("Password: %s\n", userInfo.Password)
	
	fmt.Println("Logging in, test")
	loginInfo := users.LoginInfo {
		Username: userInfo.Username,
		Password: userInfo.Password,
	}
	
	sessionToken, err := users.Login(loginInfo)
	if err != nil {
		fmt.Printf("Failed to test login: %s\n", err)
		return false;
	}
	
	fmt.Printf("Login succesful, session token: %s\n", *sessionToken)
	
	return true
}


