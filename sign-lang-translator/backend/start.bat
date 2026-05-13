@echo off
title Signa AI Backend
echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║   Signa AI — ASL Translation Backend      ║
echo  ║   WebSocket:  ws://localhost:8000/ws      ║
echo  ║   Docs:       http://localhost:8000/docs  ║
echo  ╚═══════════════════════════════════════════╝
echo.

cd /d "%~dp0\.."

:: Activate virtualenv if available
if exist "..\venv\Scripts\activate.bat" (
    echo [*] Activating venv...
    call ..\venv\Scripts\activate.bat
) else if exist "..\venv-tfjs\Scripts\activate.bat" (
    echo [*] Activating venv-tfjs...
    call ..\venv-tfjs\Scripts\activate.bat
)

:: Install / update requirements
echo [1/2] Checking Python dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [!] Dependency install failed. Check requirements.txt.
    pause
    exit /b 1
)

:: Verify model file
if not exist "backend\models\asl_model.pth" (
    echo.
    echo  ERROR: models\asl_model.pth not found!
    echo  The model file should be at backend\models\asl_model.pth
    echo.
    pause
    exit /b 1
)

echo [2/2] Starting Signa AI backend server...
echo.
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload

pause
