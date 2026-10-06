from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jwt.exceptions import PyJWTError

from ytasty_crousty.database import get_db
from ytasty_crousty.modules.users.models import User
from ytasty_crousty.modules.auths.jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception

    return user

class RoleChecker:
    """Classe permettant de générer des dépendances dynamiques selon les rôles autorisés."""

    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role.value not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Opération non autorisée pour ce rôle"
            )
        return user


# Instances prêtes à être importées dans vos routeurs (ex: Depends(allow_admin))
allow_admin = RoleChecker(["admin"])
allow_staff_admin = RoleChecker(["admin", "staff"])
allow_staff_admin_direction = RoleChecker(["admin", "staff", "direction"])
