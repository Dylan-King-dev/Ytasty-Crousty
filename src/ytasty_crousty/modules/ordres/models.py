import enum 
from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ytasty_crousty.database import Base

class OrderStatusEnum(str, enum.Enum):
    pending = "pending"
    validated = "validated"
    preparing = "preparing"
    ready = "ready"
    collected = "collected"
    cancelled = "cancelled"

class PickupModeEnum(str, enum.Enum):
    onsite = "onsite"
    takeaway = "takeaway"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    order_number = Column(String(50), nullable=False, unique=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    total_price = Column(Numeric(10, 2), nullable=False)

    # Corrections apportées ici :
    status = Column(Enum(OrderStatusEnum), nullable=False, default=OrderStatusEnum.pending)
    pickup_mode = Column(Enum(PickupModeEnum), nullable=False)

    customer_name = Column(String(150))
    customer_email = Column(String(150))

    restaurant = relationship("Restaurant", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    @property

    def customer(self):
        """Regroupe nom et email pour correspondre au schéma OrderResponse."""
        return {"name": self.customer_name, "email": self.customer_email}

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")