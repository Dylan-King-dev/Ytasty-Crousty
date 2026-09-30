from ytasty_crousty.database import SessionLocal, Base, engine

# On importe tous les models pour qu'ils soient enregistrés dans Base
# avant de créer les tables avec create_all()
from ytasty_crousty.modules.restaurants.models import Restaurant
from ytasty_crousty.modules.users.models import User, RoleEnum
from ytasty_crousty.modules.products.models import Product
from ytasty_crousty.modules.ordres.models import Order, OrderItem
from ytasty_crousty.modules.auths.security import hash_password

RESTAURANT_NAMES = [
    ("Ytasty Crousty Aix", "Aix-en-Provence"),
    ("Ytasty Crousty Paris", "Paris"),
    ("Ytasty Crousty Lyon", "Lyon"),
]

def seed():
    """Fonction pour remplir la base de données avec des données initiales."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Restaurant).count() == 0:
        for name, city in RESTAURANT_NAMES:
            restaurant = Restaurant(
                name=name,
                city=city,
                address="Adress à compléter",
                is_open=True,
                opening_hours="11:00-22:00",
                contact="0000000000",
            )
            db.add(restaurant)
        db.commit()

    existing_admin = db.query(User).filter(User.username == "admin123").first()
    if existing_admin is None:
        admin = User(
            first_name="Admin",
            last_name="Ytasty",
            username="admin123",
            hashed_password=hash_password("Admin@123456"),
            role=RoleEnum.admin,
        )
        db.add(admin)
        db.commit()

    print("Restaurants en base :", db.query(Restaurant).count())
    print("Utilisateurs en base :", db.query(User).count())

    db.close()

if __name__ == "__main__":
    seed()
        
