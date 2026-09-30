from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ytasty_crousty.database import get_db
from ytasty_crousty.modules.products.models import Product
from ytasty_crousty.modules.products.schemas import ProductResponse, ProductCreate, ProductAvailability
from ytasty_crousty.modules.auths.dependencies import allow_staff_admin_direction

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse], status_code=status.HTTP_200_OK)
def get_products(
        category: Optional[str] = Query(None),
        q: Optional[str] = Query(None),
        restaurant_id: Optional[int] = Query(None),
        is_available: Optional[bool] = Query(None),
        db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))
    if restaurant_id:
        query = query.filter(Product.restaurant_id == restaurant_id)
    if is_available is not None:
        query = query.filter(Product.is_available == is_available)
    return query.all()


@router.get("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit introuvable.")
    return product


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ProductResponse)
def create_product(
        product: ProductCreate,
        db: Session = Depends(get_db),
        current_user=Depends(allow_staff_admin_direction)
):
    if current_user.role.value == "staff" and current_user.restaurant_id != product.restaurant_id:
        raise HTTPException(status_code=403, detail="Vous ne pouvez créer des produits que pour votre restaurant.")

    new_product = Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.patch("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def update_product(
        product_id: int,
        data: ProductCreate,
        db: Session = Depends(get_db),
        current_user=Depends(allow_staff_admin_direction)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit introuvable.")

    if current_user.role.value == "staff" and (
        current_user.restaurant_id != product.restaurant_id
        or current_user.restaurant_id != data.restaurant_id
    ):
        raise HTTPException(status_code=403, detail="Accès refusé.")

    for field, value in data.model_dump().items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}/availability", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def update_product_availability(
        product_id: int,
        data: ProductAvailability,
        db: Session = Depends(get_db),
        current_user=Depends(allow_staff_admin_direction)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit introuvable.")

    if current_user.role.value == "staff" and current_user.restaurant_id != product.restaurant_id:
        raise HTTPException(status_code=403, detail="Accès refusé.")

    product.is_available = data.is_available
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
        product_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(allow_staff_admin_direction)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit introuvable.")

    if current_user.role.value == "staff" and current_user.restaurant_id != product.restaurant_id:
        raise HTTPException(status_code=403, detail="Accès refusé.")

    db.delete(product)
    db.commit()
    return None