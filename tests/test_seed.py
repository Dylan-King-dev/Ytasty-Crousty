import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from ytasty_crousty.database import Base
from ytasty_crousty.modules.products.models import Product
from ytasty_crousty.modules.restaurants.models import Restaurant
from ytasty_crousty.modules.users.models import RoleEnum, User
from ytasty_crousty.seed import remove_retired_restaurants, seed_restaurants, seed_users


class SeedTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(bind=self.engine)
        self.db = Session(self.engine)

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_seed_users_can_run_twice_without_duplicates(self):
        seed_restaurants(self.db)
        seed_users(self.db)
        seed_users(self.db)

        self.assertEqual(self.db.query(Restaurant).count(), 3)
        self.assertEqual(self.db.query(User).count(), 5)
        self.assertEqual(
            self.db.query(User).filter(User.role == RoleEnum.staff).count(),
            3,
        )

    def test_retired_restaurant_without_orders_is_removed_with_products_and_users(self):
        restaurant = Restaurant(
            name="Ytasty Crousty Lille",
            city="Lille",
            address="1 rue de Lille",
            is_open=True,
        )
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)

        self.db.add(
            Product(
                name="Produit test",
                category="Test",
                price=1.0,
                restaurant_id=restaurant.id,
            )
        )
        self.db.add(
            User(
                first_name="Test",
                last_name="Employe",
                username="stafftest",
                hashed_password="test-hash",
                role=RoleEnum.staff,
                restaurant_id=restaurant.id,
            )
        )
        self.db.commit()

        remove_retired_restaurants(self.db)

        self.assertIsNone(
            self.db.query(Restaurant).filter(Restaurant.name == restaurant.name).first()
        )
        self.assertEqual(
            self.db.query(Product).filter(Product.restaurant_id == restaurant.id).count(),
            0,
        )
        self.assertEqual(
            self.db.query(User).filter(User.restaurant_id == restaurant.id).count(),
            0,
        )


if __name__ == "__main__":
    unittest.main()
