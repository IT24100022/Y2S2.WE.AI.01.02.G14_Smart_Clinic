@echo off
title Dent AI System Launcher

echo ==============================================
echo       Starting Dent AI Local Environment
echo ==============================================
echo.

echo [1/3] Database: MongoDB runs automatically as a Windows background service.
echo.

echo [2/3] Starting the Backend Server...
start "Dent AI - Backend Server" cmd /k "cd server && npm run dev"

echo [3/3] Starting the Frontend Application...
start "Dent AI - Frontend App" cmd /k "cd client && npm run dev"

echo.
echo ==============================================
echo Both servers are launching in separate windows!
echo Please wait a few seconds for them to load.
echo.
echo Application URL: http://localhost:5173
echo Backend API: http://localhost:5000
echo ==============================================
echo.
pause
