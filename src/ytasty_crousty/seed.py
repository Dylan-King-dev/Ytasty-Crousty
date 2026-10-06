from ytasty_crousty.database import SessionLocal, Base, engine

from ytasty_crousty.modules.restaurants.models import Restaurant
from ytasty_crousty.modules.users.models import User, RoleEnum
from ytasty_crousty.modules.products.models import Product
from ytasty_crousty.modules.ordres.models import Order
from ytasty_crousty.modules.auths.security import hash_password

RESTAURANT_NAMES = [
    ("Ytasty Crousty Aix", "Aix-en-Provence"),
    ("Ytasty Crousty Paris", "Paris"),
    ("Ytasty Crousty Lyon", "Lyon"),
]

RETIRED_RESTAURANT_NAMES = [
    "Ytasty Crousty Marseille",
    "Ytasty Crousty Lille",
]


def remove_retired_restaurants(db):
    for name in RETIRED_RESTAURANT_NAMES:
        restaurant = db.query(Restaurant).filter(Restaurant.name == name).first()
        if restaurant is None:
            continue

        has_orders = db.query(Order).filter(Order.restaurant_id == restaurant.id).first()
        if has_orders:
            restaurant.is_open = False
            print(f"{name} conservé fermé car il possède des commandes historiques.")
            continue

        db.query(Product).filter(Product.restaurant_id == restaurant.id).delete(
            synchronize_session=False
        )
        db.query(User).filter(User.restaurant_id == restaurant.id).delete(
            synchronize_session=False
        )
        db.delete(restaurant)

    db.commit()


def seed_restaurants(db):
    for name, city in RESTAURANT_NAMES:
        existing = db.query(Restaurant).filter(Restaurant.name == name).first()

        if existing:
            continue

        db.add(
            Restaurant(
                name=name,
                city=city,
                address=f"1 place principale, {city}",
                is_open=True,
                opening_hours="11:00-22:00",
                contact="0100000000",
            )
        )

    db.commit()


def seed_users(db):
    restaurants = {
        restaurant.name: restaurant.id
        for restaurant in db.query(Restaurant).all()
    }
    demo_users = [
        ("Alice", "Martin", "staffaix", "staff_aix", RoleEnum.staff, "Ytasty@12345", "Ytasty Crousty Aix"),
        ("Lucas", "Bernard", "staffparis", "staff_paris", RoleEnum.staff, "Ytasty@12345", "Ytasty Crousty Paris"),
        ("Emma", "Petit", "stafflyon", "staff_lyon", RoleEnum.staff, "Ytasty@12345", "Ytasty Crousty Lyon"),
        ("Camille", "Durand", "direction", None, RoleEnum.direction, "Ytasty@12345", None),
        ("Admin", "Ytasty", "admin123", None, RoleEnum.admin, "Admin@123456", None),
    ]

    for first_name, last_name, username, legacy_username, role, password, restaurant_name in demo_users:
        restaurant_id = restaurants.get(restaurant_name) if restaurant_name else None
        existing = db.query(User).filter(User.username == username).first()

        if existing is None and legacy_username:
            existing = db.query(User).filter(User.username == legacy_username).first()

        if existing:
            existing.first_name = first_name
            existing.last_name = last_name
            existing.username = username
            existing.hashed_password = hash_password(password)
            existing.role = role
            existing.restaurant_id = restaurant_id
            continue

        db.add(
            User(
                first_name=first_name,
                last_name=last_name,
                username=username,
                hashed_password=hash_password(password),
                role=role,
                restaurant_id=restaurant_id,
            )
        )

    db.commit()


def seed_products(db):
    restaurants = {
        restaurant.name: restaurant
        for restaurant in db.query(Restaurant).all()
    }

    product_templates = [
        {
            "restaurant_name": "Ytasty Crousty Aix",
            "name": "Burger Classique",
            "category": "Burger",
            "description": "Burger savoureux avec fromage, salade et sauce maison.",
            "price": 12.90,
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["pain", "steak", "fromage", "salade"],
        },
        {
            "restaurant_name": "Ytasty Crousty Paris",
            "name": "Pizza Margherita",
            "category": "Pizza",
            "description": "Pizza traditionnelle avec tomate, mozzarella et basilic.",
            "price": 14.50,
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["pâte", "tomate", "mozzarella", "basilic"],
        },
        {
            "restaurant_name": "Ytasty Crousty Lyon",
            "name": "Wrap Poulet",
            "category": "Wrap",
            "description": "Wrap grillé au poulet, légumes frais et sauce légère.",
            "price": 11.20,
            "image": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["wrap", "poulet", "salade", "tomate"],
        },
        {
            "restaurant_name": "Ytasty Crousty Aix",
            "name": "Salade César",
            "category": "Salade",
            "description": "Salade fraîche avec poulet grillé et parmesan.",
            "price": 10.80,
            "image": "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["salade", "poulet", "parmesan", "croutons"],
        },
        {
            "restaurant_name": "Ytasty Crousty Paris",
            "name": "Tacos Végétarien",
            "category": "Tacos",
            "description": "Tacos végétariens aux légumes et sauce avocat.",
            "price": 13.40,
            "image": "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["tortilla", "poivron", "maïs", "avocat"],
        },
        {
            "restaurant_name": "Ytasty Crousty Lyon",
            "name": "Nuggets",
            "category": "Snack",
            "description": "Nuggets croustillants servis avec sauce barbecue.",
            "price": 8.90,
            "image": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["poulet", "chapelure", "sauce barbecue"],
        },
        {
            "restaurant_name": "Ytasty Crousty Aix",
            "name": "Pasta Carbonara",
            "category": "Pasta",
            "description": "Pâtes croustillantes et crémeuses, parfaites pour un repas gourmand.",
            "price": 15.20,
            "image": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["pâtes", "œuf", "parmesan", "poitrine de poulet"],
        },
        {
            "restaurant_name": "Ytasty Crousty Paris",
            "name": "Sandwich Club",
            "category": "Sandwich",
            "description": "Sandwich généreux avec poulet, bacon et légumes croquants.",
            "price": 9.50,
            "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["pain", "poulet", "bacon", "salade"],
        },
        {
            "restaurant_name": "Ytasty Crousty Lyon",
            "name": "Donut Chocolat",
            "category": "Dessert",
            "description": "Dessert au chocolat fondant, parfait pour finir le repas.",
            "price": 6.90,
            "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
            "is_available": True,
            "ingredients": ["farine", "chocolat", "beurre", "sucre"],
        },
        {
            "restaurant_name": "Ytasty Crousty Aix",
            "name": "Burger Végétarien",
            "category": "Burger",
            "description": "Burger aux légumes grillés et au fromage frais.",
            "price": 12.50,
            "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80",
            "ingredients": ["pain", "galette végétale", "salade", "tomate"],
        },
        {
            "restaurant_name": "Ytasty Crousty Aix",
            "name": "Brownie au Chocolat",
            "category": "Dessert",
            "description": "Brownie moelleux au chocolat et aux noix.",
            "price": 5.50,
            "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
            "ingredients": ["chocolat", "farine", "œuf", "noix"],
        },
        {
            "restaurant_name": "Ytasty Crousty Paris",
            "name": "Pizza Reine",
            "category": "Pizza",
            "description": "Pizza avec jambon, champignons et mozzarella.",
            "price": 15.90,
            "image": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
            "ingredients": ["pâte", "tomate", "jambon", "champignons", "mozzarella"],
        },
        {
            "restaurant_name": "Ytasty Crousty Paris",
            "name": "Frites Maison",
            "category": "Accompagnement",
            "description": "Frites dorées servies avec une sauce au choix.",
            "price": 4.50,
            "image": "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80",
            "ingredients": ["pommes de terre", "huile", "sel"],
        },
        {
            "restaurant_name": "Ytasty Crousty Lyon",
            "name": "Tacos Poulet",
            "category": "Tacos",
            "description": "Tacos au poulet grillé, fromage et sauce blanche.",
            "price": 11.90,
            "image": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
            "ingredients": ["tortilla", "poulet", "fromage", "salade"],
        },
        {
            "restaurant_name": "Ytasty Crousty Lyon",
            "name": "Milkshake Vanille",
            "category": "Boisson",
            "description": "Milkshake frais à la vanille.",
            "price": 5.90,
            "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
            "ingredients": ["lait", "glace", "vanille"],
        },
    ]

    for product_data in product_templates:
        restaurant = restaurants.get(product_data["restaurant_name"])
        if restaurant is None:
            continue

        existing = db.query(Product).filter(
            Product.name == product_data["name"],
            Product.restaurant_id == restaurant.id
        ).first()

        if existing:
            if existing.image != product_data["image"]:
                existing.image = product_data["image"]
            continue

        product = product_data.copy()
        product["restaurant_id"] = restaurant.id
        del product["restaurant_name"]
        db.add(Product(**product))

    db.commit()


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        remove_retired_restaurants(db)
        seed_restaurants(db)
        seed_users(db)
        seed_products(db)

        print("Restaurants en base :", db.query(Restaurant).count())
        print("Produits en base :", db.query(Product).count())
        print("Utilisateurs en base :", db.query(User).count())
    finally:
        db.close()
