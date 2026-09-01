@echo off
setlocal EnableDelayedExpansion
title Factory One V4 Local Preview
cd /d "%~dp0"

set "PYEXE="
where py >nul 2>nul
if %errorlevel%==0 set "PYEXE=py"

if not defined PYEXE (
  where python >nul 2>nul
  if %errorlevel%==0 set "PYEXE=python"
)

if not defined PYEXE (
  echo ERROR: Python not found.
  pause
  exit /b 1
)

set "PORT=8000"
powershell -NoProfile -Command "$c=New-Object Net.Sockets.TcpClient; try{$c.Connect('127.0.0.1',8000);$c.Close();exit 1}catch{exit 0}" >nul 2>nul
if not %errorlevel%==0 set "PORT=8001"

echo Starting Factory One local server on port %PORT%...
start "Factory One Local Server" cmd /k "%PYEXE% -m http.server %PORT% --bind 127.0.0.1"

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
exit /b 0
