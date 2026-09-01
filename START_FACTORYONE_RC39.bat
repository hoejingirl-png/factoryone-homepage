@echo off
setlocal
cd /d "%~dp0"
title Factory One RC39
set PORT=8049
echo.
echo =========================================
echo   FACTORY ONE RC39 - TRAFFIC READY
echo   http://127.0.0.1:%PORT%/tools/
echo   http://127.0.0.1:%PORT%/admin/traffic-diagnostics.html
echo =========================================
echo.
start "" "http://127.0.0.1:%PORT%/tools/"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 SEO_AUDIT_RC35.py
  py -3 -m http.server %PORT% --bind 127.0.0.1
) else (
  python SEO_AUDIT_RC35.py
  python -m http.server %PORT% --bind 127.0.0.1
)
pause
