from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ytasty_crousty.database import get_db
from ytasty_crousty.modules.users.models import User
from ytasty_crousty.modules.users.schemas import UserCreate, UserResponse
from ytasty_crousty.modules.auths.dependencies import allow_admin
from ytasty_crousty.modules.auths.security import hash_password

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(
        user: UserCreate,
        db: Session = Depends(get_db),
        current_admin=Depends(allow_admin)
):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Cet identifiant existe déjà.")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        hashed_password=hash_password(user.password),
        role=user.role,
        restaurant_id=user.restaurant_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("", response_model=List[UserResponse], status_code=status.HTTP_200_OK)
def get_users(db: Session = Depends(get_db), current_admin=Depends(allow_admin)):
    return db.query(User).all()


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_admin=Depends(allow_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas supprimer votre propre compte.")

    db.delete(user)
    db.commit()
    return None