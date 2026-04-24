package main

import (
	"backend/utils"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	_ "github.com/lib/pq"
	_ "golang.org/x/crypto/argon2"
)

var database *sql.DB;

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
	database, err = sql.Open("postgres", fmt.Sprintf(
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
		AllowOrigins: []string {
			"http://" + web_hostname,
			"http://" + web_hostname + ":" + web_port + "",
		},
	}))
	
	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"name": "Hewwwoo!",
		})
	})
	
	router.Run()
}

func tryMakeFirstUser() bool {
	// ignore any data, only want to know if there any records or not
	var ignored string
	err := database.QueryRow("SELECT 1 FROM Users LIMIT 1").Scan(&ignored)
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
	userInfo := CreateUserInfo {
		username: "admin",
		fullName: "The Administrator",
		password: password,
		displayName: "Administrator",
		role: RoleAdmin,
	}
	
	err = createUser(&userInfo)
	
	if err != nil {
		fmt.Printf("Cannot create initial user: %s\n", err)
		return false;
	}
	
	fmt.Println("Initial user created")
	fmt.Printf("Username: %s\n", userInfo.username)
	fmt.Printf("Password: %s\n", userInfo.password)
	
	return true
}

type UserRole string
const (
	RoleAdmin UserRole = "Admin"
	RoleHRD UserRole = "HRD"
	RoleDeveloper UserRole = "Developer"
	RoleAccounting UserRole = "Accounting"
)

type CreateUserInfo struct {
	username string;
	fullName string;
	displayName string;
	password string;
	role UserRole;
}

var DuplicateUsername = errors.New("DuplicateUsername")
var IllegalUsernam = errors.New("IllegalUsernam")
var InsecurePasswor = errors.New("InsecurePasswor")
var ServerErro = errors.New("ServerErro")

func createUser(info *CreateUserInfo) (error) {
	hashedPassword := utils.HashPassword(info.password);
	
	database.Exec(
		"INSERT INTO Users (username, fullname, display_name, user_role, password_hash) " +
		"VALUES ($1, $2, $3, $4, $5) ",
		info.username, info.fullName, info.displayName, info.role, hashedPassword,
	)
	
	return nil
}


