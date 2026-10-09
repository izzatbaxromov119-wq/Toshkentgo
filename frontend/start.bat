@echo off
cd /d "%~dp0"
echo ===================================================
echo   TashkentGo frontend
echo ===================================================

REM ---- Node.js'ni topish: avval PATH, keyin eng ko'p uchraydigan o'rnatish joylari ----
set "NODE_DIR="

where node >nul 2>nul && for /f "delims=" %%P in ('where node') do if not defined NODE_DIR for %%F in ("%%P") do set "NODE_DIR=%%~dpF"

if not defined NODE_DIR (
    for %%D in (
        "%ProgramFiles%\nodejs"
        "%ProgramFiles(x86)%\nodejs"
        "%LocalAppData%\Programs\nodejs"
    ) do (
        if not defined NODE_DIR if exist "%%~D\node.exe" set "NODE_DIR=%%~D"
    )
)

if not defined NODE_DIR (
    echo [XATO] Node.js topilmadi.
    echo.
    echo Shu yerdan o'rnating ^(LTS versiyani tanlang^): https://nodejs.org/
    echo O'rnatgandan so'ng kompyuteringizni ^(yoki hech bo'lmasa shu terminalni^) qayta ishga tushiring.
    pause
    exit /b 1
)

set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"
for /f "delims=" %%v in ('"%NODE_EXE%" --version') do echo Node.js topildi: %%v

if not exist "node_modules" (
    echo Paketlar o'rnatilmoqda ^(birinchi marta biroz vaqt oladi^)...
    call "%NPM_CMD%" install
    if errorlevel 1 (
        echo [XATO] Paketlarni o'rnatib bo'lmadi. Internet aloqasini tekshiring.
        pause
        exit /b 1
    )
)

if not exist ".env" (
    copy /y ".env.example" ".env" >nul
)

echo ===================================================
echo   Sayt: http://localhost:5173
echo   To'xtatish uchun shu oynani yoping yoki Ctrl+C bosing.
echo   ^(Backend ham start.bat orqali ishga tushgan bo'lishi kerak^)
echo ===================================================
call "%NPM_CMD%" run dev

pause
