from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

# Importation de tous les routeurs de l'application
from ytasty_crousty.modules.auths.router import router as auth_router
from ytasty_crousty.modules.users.router import router as users_router
from ytasty_crousty.modules.restaurants.router import router as restaurants_router
from ytasty_crousty.modules.products.router import router as products_router
from ytasty_crousty.modules.ordres.router import router as orders_router

app = FastAPI(
    title="Ytasty Crousty API",
    description="API REST pour la gestion du réseau de restaurants Ytasty Crousty.",
    version="1.0.0"
)

# Autorise le frontend Vite (port 5173) à appeler l'API depuis le navigateur
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    return {"status": "ok"}

# Enregistrement des différents modules (Routes)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(restaurants_router)
app.include_router(products_router)
app.include_router(orders_router)