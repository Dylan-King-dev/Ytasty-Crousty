from fastapi import APIRouter, BackgroundTasks, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from ytasty_crousty.database import get_db
from ytasty_crousty.modules.ordres.models import Order, OrderItem
from ytasty_crousty.modules.restaurants.models import Restaurant
from ytasty_crousty.modules.products.models import Product
from ytasty_crousty.modules.ordres.schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from ytasty_crousty.modules.auths.dependencies import allow_staff_admin_direction
from ytasty_crousty.realtime import send_order_status

router = APIRouter(tags=["Orders"])


@router.post("/orders", status_code=status.HTTP_201_CREATED, response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    if not restaurant or not restaurant.is_open:
        raise HTTPException(status_code=400, detail="Restaurant introuvable ou fermé.")

    total_price = 0.0
    db_items = []

    for item in order.items:
        if item.quantity <= 0:
            raise HTTPException(status_code=400, detail="La quantité doit être supérieure à 0.")

        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product or product.restaurant_id != order.restaurant_id or not product.is_available:
            raise HTTPException(status_code=400, detail=f"Produit {item.product_id} invalide ou indisponible.")

        total_price += float(product.price) * item.quantity
        db_items.append(
            OrderItem(product_id=product.id, quantity=item.quantity, unit_price=product.price)
        )

    new_order = Order(
        order_number=f"CMD-{uuid.uuid4().hex[:8].upper()}",
        restaurant_id=order.restaurant_id,
        total_price=total_price,
        pickup_mode=order.pickup_mode,
        customer_name=order.customer.name,
        customer_email=order.customer.email,
        status="pending"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for db_item in db_items:
        db_item.order_id = new_order.id
        db.add(db_item)

    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/orders/{order_number}", response_model=OrderResponse, status_code=status.HTTP_200_OK)
def get_order(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable.")
    return order


@router.get("/restaurants/{restaurant_id}/orders", response_model=List[OrderResponse], status_code=status.HTTP_200_OK)
def get_restaurant_orders(
        restaurant_id: int,
        status_filter: Optional[str] = Query(None, alias="status"),
        db: Session = Depends(get_db),
        current_user=Depends(allow_staff_admin_direction)
):
    if current_user.role.value == "staff" and current_user.restaurant_id != restaurant_id:
        raise HTTPException(status_code=403, detail="Accès refusé.")

    query = db.query(Order).filter(Order.restaurant_id == restaurant_id)
    if status_filter:
        query = query.filter(Order.status == status_filter)
    return query.all()


@router.patch("/orders/{order_number}/status", response_model=OrderResponse, status_code=status.HTTP_200_OK)
async def update_order_status(
        order_number: str,
        data: OrderStatusUpdate,
    background_tasks: BackgroundTasks,
        db: Session = Depends(get_db),
        current_user=Depends(allow_staff_admin_direction)
):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable.")

    if current_user.role.value == "staff" and current_user.restaurant_id != order.restaurant_id:
        raise HTTPException(status_code=403, detail="Accès refusé.")

    order.status = data.status
    db.commit()
    db.refresh(order)
    await send_order_status(order.order_number, data.status)
    return order


@router.post("/orders/{order_number}/cancel", response_model=OrderResponse, status_code=status.HTTP_200_OK)
async def cancel_order(
        order_number: str,
    background_tasks: BackgroundTasks,
        db: Session = Depends(get_db),
        current_user=Depends(allow_staff_admin_direction)
):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable.")

    if current_user.role.value == "staff" and current_user.restaurant_id != order.restaurant_id:
        raise HTTPException(status_code=403, detail="Accès refusé.")

    order.status = "cancelled"
    db.commit()
    db.refresh(order)
    await send_order_status(order.order_number, "cancelled")
    return order