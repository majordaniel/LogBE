#!/bin/bash

npm install

npm run db:migrate

pm2 restart 0

