package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	web_hostname := os.Getenv("NEXT_PUBLIC_WEB_HOSTNAME")
	web_port := os.Getenv("NEXT_PUBLIC_WEB_PORT")
	
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
