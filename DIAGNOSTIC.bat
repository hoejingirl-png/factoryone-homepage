@echo off
setlocal
title Factory One Diagnostics
cd /d "%~dp0"
echo ===== FACTORY ONE DIAGNOSTIC =====
echo Folder:
cd
echo.
echo Python launcher:
where py
echo.
echo Python:
where python
echo.
echo Files:
dir /b
echo.
pause
