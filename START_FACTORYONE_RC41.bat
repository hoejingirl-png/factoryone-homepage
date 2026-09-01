@echo off
cd /d %~dp0
start http://localhost:8051/
python -m http.server 8051
