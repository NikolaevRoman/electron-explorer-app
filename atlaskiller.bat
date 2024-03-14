tasklist /FI "IMAGENAME eq explorer-app.exe" 2>NUL | find /I /N "explorer-app.exe">NUL
if "%ERRORLEVEL%"=="0" taskkill /f /im explorer-app.exe
exit