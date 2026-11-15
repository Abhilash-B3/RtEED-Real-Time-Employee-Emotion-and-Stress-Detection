
#!/bin/bash

# Navigate to backend directory if not already there
cd "$(dirname "$0")"

echo "Step 1: Creating virtual environment..."
python3 -m venv venv

echo "Step 2: Activating environment..."
source venv/bin/activate

echo "Step 3: Installing dependencies from requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt

echo "------------------------------------------------"
echo "Setup Complete!"
echo "To start the backend, run:"
echo "source venv/bin/activate"
echo "uvicorn main:app --reload"
echo "------------------------------------------------"
