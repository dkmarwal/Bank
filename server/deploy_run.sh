#!/bin/bash
cd /admin_portal
sudo pm2 delete -f admin_portal
sudo pm2 start -f index.js --name admin_portal
sudo pm2 save --name admin_portal