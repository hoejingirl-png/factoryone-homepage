@echo off
setlocal
cd /d "%~dp0"
title Factory One RC40
set PORT=8050
echo.
echo =========================================
echo   FACTORY ONE RC40 - GA4 CONNECTED
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
