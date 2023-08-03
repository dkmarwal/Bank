#!/bin/bash
cd /"$1"/admin_portal
sudo pm2 stop -f admin_portal_"$1"
sudo pm2 delete -f admin_portal_"$1"
sudo NODE_ENV="$1" pm2 start -f index.js --name admin_portal_"$1"
sudo pm2 save --name admin_portal_"$1"