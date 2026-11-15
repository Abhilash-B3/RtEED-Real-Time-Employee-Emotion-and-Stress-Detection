from fastapi import APIRouter, HTTPException, status, Depends
from models import UserCreate, UserLogin, UserInDB, UserResponse, Token
from database import db
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from typing import Optional

router = APIRouter()

# Security Config
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await db.db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Logic to determine role (simple logic based on email domain or keyword for now)
    # Using 'emp' in email as a trigger for employee role, else admin for demo purposes
    # Or just default to 'EMPLOYEE' and have a manual admin override in DB
    role = "EMPLOYEE"
    if "admin" in user.email.lower():
        role = "ADMIN"

    user_dict = user.dict()
    hashed_password = get_password_hash(user_dict.pop("password"))
    
    new_user = {
        **user_dict,
        "hashed_password": hashed_password,
        "role": role,
        "created_at": datetime.utcnow()
    }
    
    result = await db.db.users.insert_one(new_user)
    created_user = await db.db.users.find_one({"_id": result.inserted_id})
    
    return UserResponse(**created_user, id=str(created_user["_id"]))

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    user = await db.db.users.find_one({"email": user_credentials.email})
    
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"], "id": str(user["_id"])},
        expires_delta=access_token_expires
    )
    
    # Re-structure user response to fit the frontend User interface
    user_resp = UserResponse(**user, id=str(user["_id"]))
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user_resp
    }
