@echo off
REM start-dev.bat - installs deps (if needed) and starts the dev server

:: ASCII logo
echo  ____             _               _                      
echo |  _ \  ___   __| | ___  _ __ __| | ___ _ __   ___ _ __  
echo | | | |/ _ \ / _` |/ _ \| '__/ _` |/ _ \ '_ \ / _ \ '__| 
echo | |_| | (_) | (_| | (_) | | | (_| |  __/ | | |  __/ |    
echo |____/ \___/ \__,_|\___/|_|  \__,_|\___|_| |_|\___|_|    
echo.

n:: move to script directory (handles different drives)
cd /d "%~dp0"

necho Installing dependencies (if needed)...
npm install

necho Starting dev server (npm run start)...
npm run start

necho Dev server exited. Press any key to close.
pause > nul
