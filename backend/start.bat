@echo off
cd /d "%~dp0"

set "PY="
if not defined PY where py >nul 2>nul && set "PY=py"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY where python3 >nul 2>nul && set "PY=python3"
if not defined PY if exist "%LocalAppData%\Programs\Python\Python313\python.exe" set "PY=%LocalAppData%\Programs\Python\Python313\python.exe"
if not defined PY if exist "%LocalAppData%\Programs\Python\Python312\python.exe" set "PY=%LocalAppData%\Programs\Python\Python312\python.exe"
if not defined PY if exist "%LocalAppData%\Programs\Python\Python311\python.exe" set "PY=%LocalAppData%\Programs\Python\Python311\python.exe"
if not defined PY if exist "%LocalAppData%\Programs\Python\Python310\python.exe" set "PY=%LocalAppData%\Programs\Python\Python310\python.exe"
if not defined PY if exist "%ProgramFiles%\Python313\python.exe" set "PY=%ProgramFiles%\Python313\python.exe"
if not defined PY if exist "%ProgramFiles%\Python312\python.exe" set "PY=%ProgramFiles%\Python312\python.exe"
if not defined PY if exist "%ProgramFiles%\Python311\python.exe" set "PY=%ProgramFiles%\Python311\python.exe"
if not defined PY if exist "%ProgramFiles%\Python310\python.exe" set "PY=%ProgramFiles%\Python310\python.exe"
if not defined PY if exist "%ProgramFiles(x86)%\Python313\python.exe" set "PY=%ProgramFiles(x86)%\Python313\python.exe"
if not defined PY if exist "%ProgramFiles(x86)%\Python312\python.exe" set "PY=%ProgramFiles(x86)%\Python312\python.exe"
if not defined PY if exist "%ProgramFiles(x86)%\Python311\python.exe" set "PY=%ProgramFiles(x86)%\Python311\python.exe"
if not defined PY if exist "%ProgramFiles(x86)%\Python310\python.exe" set "PY=%ProgramFiles(x86)%\Python310\python.exe"

if not defined PY (
    echo [XATO] Python topilmadi.
    echo Python 3.10 yoki undan yangisini shu yerdan o'rnating: https://www.python.org/downloads/
    echo O'rnatish oynasida pastdagi "Add python.exe to PATH" katagini albatta belgilang.
    pause
    exit /b 1
)

"%PY%" bootstrap.py
pause
