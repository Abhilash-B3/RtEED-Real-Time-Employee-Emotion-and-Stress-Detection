
@echo off
setlocal
cd /d %~dp0

echo Step 1: Creating virtual environment...
python -m venv venv

echo Step 2: Activating environment...
call venv\Scripts\activate

echo Step 3: Installing dependencies from requirements.txt...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo ------------------------------------------------
echo Setup Complete!
echo To start the backend, run:
echo venv\Scripts\activate
echo uvicorn main:app --reload
echo ------------------------------------------------
pause
