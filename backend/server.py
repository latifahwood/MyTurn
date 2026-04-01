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

# Circle Models
class Circle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    contributionAmount: float
    frequency: str = "monthly"  # weekly, biweekly, monthly
    totalMembers: int
    memberCount: int = 1
    gracePeriodDays: int = 3
    lateFeeEnabled: bool = False
    lateFeeAmount: float = 0
    inviteCode: str
    inviteLink: str
    adminId: str
    adminName: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class CircleCreate(BaseModel):
    name: str
    contributionAmount: float
    frequency: str = "monthly"
    totalMembers: int
    gracePeriodDays: int = 3
    lateFeeEnabled: bool = False
    lateFeeAmount: float = 0
    adminId: str
    adminName: str

class CirclePreview(BaseModel):
    id: str
    name: str
    contributionAmount: float
    frequency: str
    memberCount: int
    totalMembers: int
    adminName: str

class CircleResponse(BaseModel):
    success: bool
    message: str
    circle: Optional[Circle] = None
    inviteCode: Optional[str] = None

# Membership Models
class Membership(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    userName: str
    circleId: str
    circleName: str
    role: str = "member"  # admin, member
    turnPosition: int
    joinedAt: datetime = Field(default_factory=datetime.utcnow)

class MembershipCreate(BaseModel):
    inviteCode: str
    userId: str
    userName: str

class JoinResponse(BaseModel):
    success: bool
    message: str
    membership: Optional[Membership] = None

# Helper function to generate invite code
def generate_invite_code():
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    import random
    return ''.join(random.choice(chars) for _ in range(8))

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

@api_router.get("/payments/history/{user_id}")
async def get_payment_history(user_id: str):
    """Get payment history for a user (all payments sorted by date)"""
    payments = await db.payments.find({"userId": user_id}).sort("createdAt", -1).to_list(100)
    
    # Format for frontend
    history = []
    for p in payments:
        history.append({
            "id": p.get("id"),
            "date": p.get("dueDate").strftime("%b %d, %Y") if p.get("dueDate") else "",
            "amount": p.get("totalAmountPaid", p.get("contributionAmount", 0)),
            "circleName": p.get("circleName", "Unknown Circle"),
            "status": p.get("paymentStatus", "pending"),
            "lateFee": p.get("lateFee", 0),
            "paidDate": p.get("paidDate").isoformat() if p.get("paidDate") else None,
            "daysOverdue": 0  # Would calculate from dueDate
        })
    
    return history

# Circle Endpoints
@api_router.post("/circles", response_model=CircleResponse)
async def create_circle(input: CircleCreate):
    """Create a new savings circle"""
    invite_code = generate_invite_code()
    invite_link = f"https://savingscircle.app/join/{invite_code}"
    
    circle = Circle(
        name=input.name,
        contributionAmount=input.contributionAmount,
        frequency=input.frequency,
        totalMembers=input.totalMembers,
        memberCount=1,
        gracePeriodDays=input.gracePeriodDays,
        lateFeeEnabled=input.lateFeeEnabled,
        lateFeeAmount=input.lateFeeAmount,
        inviteCode=invite_code,
        inviteLink=invite_link,
        adminId=input.adminId,
        adminName=input.adminName,
    )
    
    await db.circles.insert_one(circle.dict())
    
    # Create membership for admin
    membership = Membership(
        userId=input.adminId,
        userName=input.adminName,
        circleId=circle.id,
        circleName=circle.name,
        role="admin",
        turnPosition=1,
    )
    await db.memberships.insert_one(membership.dict())
    
    return CircleResponse(
        success=True,
        message="Circle created successfully",
        circle=circle,
        inviteCode=invite_code
    )

@api_router.get("/circles/{circle_id}", response_model=Circle)
async def get_circle(circle_id: str):
    """Get a circle by ID"""
    circle = await db.circles.find_one({"id": circle_id})
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    return Circle(**circle)

@api_router.get("/circles/invite/{invite_code}", response_model=CirclePreview)
async def get_circle_by_invite(invite_code: str):
    """Get circle preview by invite code"""
    circle = await db.circles.find_one({"inviteCode": invite_code.upper()})
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found. Please check the invite code.")
    
    return CirclePreview(
        id=circle["id"],
        name=circle["name"],
        contributionAmount=circle["contributionAmount"],
        frequency=circle["frequency"],
        memberCount=circle["memberCount"],
        totalMembers=circle["totalMembers"],
        adminName=circle["adminName"]
    )

@api_router.post("/circles/join", response_model=JoinResponse)
async def join_circle(input: MembershipCreate):
    """Join a circle using invite code"""
    # Find the circle
    circle = await db.circles.find_one({"inviteCode": input.inviteCode.upper()})
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    # Check if circle is full
    if circle["memberCount"] >= circle["totalMembers"]:
        raise HTTPException(status_code=400, detail="This circle is full")
    
    # Check if user is already a member
    existing = await db.memberships.find_one({
        "circleId": circle["id"],
        "userId": input.userId
    })
    if existing:
        raise HTTPException(status_code=400, detail="You are already a member of this circle")
    
    # Determine turn position (next available)
    turn_position = circle["memberCount"] + 1
    
    # Create membership
    membership = Membership(
        userId=input.userId,
        userName=input.userName,
        circleId=circle["id"],
        circleName=circle["name"],
        role="member",
        turnPosition=turn_position,
    )
    await db.memberships.insert_one(membership.dict())
    
    # Update circle member count
    await db.circles.update_one(
        {"id": circle["id"]},
        {"$inc": {"memberCount": 1}}
    )
    
    return JoinResponse(
        success=True,
        message=f"Successfully joined {circle['name']}",
        membership=membership
    )

@api_router.get("/circles/user/{user_id}", response_model=List[Circle])
async def get_user_circles(user_id: str):
    """Get all circles a user is a member of"""
    memberships = await db.memberships.find({"userId": user_id}).to_list(100)
    circle_ids = [m["circleId"] for m in memberships]
    circles = await db.circles.find({"id": {"$in": circle_ids}}).to_list(100)
    return [Circle(**c) for c in circles]

@api_router.get("/memberships/circle/{circle_id}", response_model=List[Membership])
async def get_circle_members(circle_id: str):
    """Get all members of a circle"""
    memberships = await db.memberships.find({"circleId": circle_id}).to_list(100)
    return [Membership(**m) for m in memberships]

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
