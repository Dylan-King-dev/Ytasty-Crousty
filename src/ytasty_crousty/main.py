import socketio

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from ytasty_crousty.seed import seed

from ytasty_crousty.modules.auths.router import router as auth_router
from ytasty_crousty.modules.users.router import router as users_router
from ytasty_crousty.modules.restaurants.router import router as restaurants_router
from ytasty_crousty.modules.products.router import router as products_router
from ytasty_crousty.modules.ordres.router import router as orders_router
from ytasty_crousty.socketio_server import sio

fastapi_app = FastAPI(
    title="Ytasty Crousty API",
    description="API REST pour la gestion du réseau de restaurants Ytasty Crousty.",
    version="1.0.0"
)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@fastapi_app.on_event("startup")
def startup_event():
    seed()

@fastapi_app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    return {"status": "ok"}

fastapi_app.include_router(auth_router)
fastapi_app.include_router(users_router)
fastapi_app.include_router(restaurants_router)
fastapi_app.include_router(products_router)
fastapi_app.include_router(orders_router)

app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)