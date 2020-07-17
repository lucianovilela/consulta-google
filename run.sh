#!/usr/bash

cd frontend
npm install
npm build
cd ..
cd server
npm install
npm start