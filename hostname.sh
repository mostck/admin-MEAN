#!/bin/bash

OLD_API_URL="\"API_URL\", \"http:\/\/.*\/api\""
echo -n "Enter host name:"
read NEW
echo "The value of host name is now $NEW."

NEW_API_URL="\"API_URL\", \"http:\/\/${NEW}\/api\""

sed -ie "s/${OLD_API_URL}/${NEW_API_URL}/g" client/dist/js/index.js
