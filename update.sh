#!/bin/bash

#! git pull

if cd ./client
then
    npm i
    bower i
    gulp build
    cd ..
fi

if cd ./api
then
    npm i
    #! pm2 restart 0
    cd ..
fi

if cd ./db
then
    #! mongoimport --db heater-silo-m2m --collection users users.json --drop
    #! mongoimport --db heater-silo-m2m --collection companies companies.json --drop
    #! mongoimport --db heater-silo-m2m --collection configs configs.json --drop
    #! mongoimport --db heater-silo-m2m --collection customers customers.json --drop
    cd ..
fi
