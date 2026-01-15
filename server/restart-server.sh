#!/bin/bash
# Script to restart the portfolio server

echo "🛑 Stopping server..."
pkill -f "node server.js" || pkill -f "nodemon.*server.js"
sleep 2

echo "🚀 Starting server..."
cd "$(dirname "$0")"
npm start
