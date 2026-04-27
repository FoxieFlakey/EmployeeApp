#!/usr/bin/sh

echo "This script will overwrites these files and initialized with example one"
echo " - config/backend.env"
echo " - config/database.env"
echo " - config/web.env"
echo " - .env"

echo -n "Press enter to continue or, Ctrl+C to cancel: "
read

cp config/backend.env.example config/backend.env
cp config/database.env.example config/database.env
cp config/web.env.example config/web.env
cp .env.example .env

