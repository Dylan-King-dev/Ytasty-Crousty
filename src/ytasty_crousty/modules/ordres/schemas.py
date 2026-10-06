from pydantic import BaseModel, ConfigDict, Field
from typing import List, Literal, Optional
from datetime import datetime

# ==========================================
# SCHÉMAS D'ENTRÉE (Création & Mise à jour)
# ==========================================

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0) # Bloque les quantités négatives ou nulles

class CustomerCreate(BaseModel):
    name: str
    email: str

class OrderCreate(BaseModel):
    restaurant_id: int
    items: List[OrderItemCreate]
    pickup_mode: Literal["onsite", "takeaway"]
    customer: CustomerCreate

class OrderStatusUpdate(BaseModel):
    status: Literal["pending", "validated", "preparing", "ready", "collected", "cancelled"]

# ==========================================
# SCHÉMAS DE SORTIE (Réponses API)
# ==========================================

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    product_name: Optional[str] = None

class CustomerResponse(BaseModel):
    name: str
    email: str

class OrderResponse(BaseModel):
    order_number: str
    restaurant_id: int
    created_at: datetime
    items: List[OrderItemResponse]
    total_price: float
    status: Literal["pending", "validated", "preparing", "ready", "collected", "cancelled"]
    pickup_mode: Literal["onsite", "takeaway"]
    customer: CustomerResponse

    model_config = ConfigDict(from_attributes=True)