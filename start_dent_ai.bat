@echo off
title Dent AI System Launcher

echo ==============================================
echo       Starting Dent AI Local Environment
echo ==============================================
echo.

echo [1/3] Database: MongoDB runs automatically as a Windows background service.
echo.

echo [2/4] Starting the Backend Server...
start "Dent AI - Backend Server" cmd /k "cd backend && npm run dev"

echo [3/4] Starting the Web Frontend...
start "Dent AI - Web Frontend" cmd /k "cd frontend-web && npm run dev"

echo [4/4] Starting the Mobile App (Expo)...
start "Dent AI - Mobile App" cmd /k "cd frontend-mobile && npx expo start"

echo.
echo ==============================================
echo All servers are launching in separate windows!
echo.
echo Web URL: http://localhost:5173
echo Backend API: http://localhost:5000
echo Mobile: Use Expo Go app on your phone
echo ==============================================
echo.
pause
