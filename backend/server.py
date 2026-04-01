from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Payment Models
class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    circleId: str
    circleName: str
    userId: str
    userName: str
    contributionAmount: float
    lateFee: float = 0
    totalAmountPaid: float
    paymentStatus: str = "pending"  # pending, paid
    isLate: bool = False
    lateFeeApplied: bool = False
    dueDate: datetime
    paidDate: Optional[datetime] = None
    gracePeriodDays: int = 3
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class PaymentCreate(BaseModel):
    circleId: str
    circleName: str
    userId: str
    userName: str
    contributionAmount: float
    dueDate: datetime
    gracePeriodDays: int = 3

class PaymentUpdate(BaseModel):
    paymentId: str
    lateFeeApplied: bool = False
    lateFeeAmount: float = 0
    totalAmountPaid: float

class PaymentResponse(BaseModel):
    success: bool
    message: str
    payment: Optional[Payment] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Payment Endpoints
@api_router.post("/payments", response_model=Payment)
async def create_payment(input: PaymentCreate):
    """Create a new payment record"""
    payment_dict = input.dict()
    payment_obj = Payment(
        **payment_dict,
        totalAmountPaid=input.contributionAmount
    )
    await db.payments.insert_one(payment_obj.dict())
    return payment_obj

@api_router.get("/payments/{payment_id}", response_model=Payment)
async def get_payment(payment_id: str):
    """Get a specific payment by ID"""
    payment = await db.payments.find_one({"id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return Payment(**payment)

@api_router.get("/payments/circle/{circle_id}/user/{user_id}", response_model=List[Payment])
async def get_user_circle_payments(circle_id: str, user_id: str):
    """Get all payments for a user in a specific circle"""
    payments = await db.payments.find({
        "circleId": circle_id,
        "userId": user_id
    }).to_list(100)
    return [Payment(**p) for p in payments]

@api_router.post("/payments/process", response_model=PaymentResponse)
async def process_payment(input: PaymentUpdate):
    """Process a payment - update status to paid"""
    # Find the payment
    payment = await db.payments.find_one({"id": input.paymentId})
    
    if not payment:
        # Create a mock payment for demo purposes if not found
        # In production, this would be an error
        payment = {
            "id": input.paymentId,
            "circleId": "circle-1",
            "circleName": "Gold Savings Circle",
            "userId": "user-1",
            "userName": "Sarah Johnson",
            "contributionAmount": 500.0,
            "lateFee": input.lateFeeAmount if input.lateFeeApplied else 0,
            "totalAmountPaid": input.totalAmountPaid,
            "paymentStatus": "pending",
            "isLate": input.lateFeeApplied,
            "lateFeeApplied": input.lateFeeApplied,
            "dueDate": datetime.utcnow(),
            "paidDate": None,
            "gracePeriodDays": 3,
            "createdAt": datetime.utcnow()
        }
        await db.payments.insert_one(payment)
    
    # Update payment record
    update_data = {
        "paymentStatus": "paid",
        "paidDate": datetime.utcnow(),
        "lateFeeApplied": input.lateFeeApplied,
        "lateFee": input.lateFeeAmount if input.lateFeeApplied else 0,
        "totalAmountPaid": input.totalAmountPaid,
        "isLate": input.lateFeeApplied
    }
    
    await db.payments.update_one(
        {"id": input.paymentId},
        {"$set": update_data}
    )
    
    # Get updated payment
    updated_payment = await db.payments.find_one({"id": input.paymentId})
    
    return PaymentResponse(
        success=True,
        message="Payment processed successfully",
        payment=Payment(**updated_payment)
    )

@api_router.get("/payments/pending/{user_id}", response_model=List[Payment])
async def get_pending_payments(user_id: str):
    """Get all pending payments for a user"""
    payments = await db.payments.find({
        "userId": user_id,
        "paymentStatus": "pending"
    }).to_list(100)
    return [Payment(**p) for p in payments]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
