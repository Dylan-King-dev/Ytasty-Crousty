import socketio

from ytasty_crousty.database import SessionLocal
from ytasty_crousty.modules.ordres.models import Order

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:5173"],
)


def order_room(order_number: str) -> str:
    return f"order:{order_number}"


async def emit_order_status(order_number: str, order_status: str):
    await sio.emit(
        "order:status",
        {"order_number": order_number, "status": order_status},
        room=order_room(order_number),
    )


@sio.on("order:join")
async def join_order(sid, data):
    if not isinstance(data, dict):
        return {"ok": False, "error": "Numéro de commande invalide."}

    order_number = data.get("order_number")
    if not isinstance(order_number, str) or not order_number.strip():
        return {"ok": False, "error": "Numéro de commande invalide."}

    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.order_number == order_number).first()
        if order is None:
            return {"ok": False, "error": "Commande introuvable."}

        current_status = order.status.value
    finally:
        db.close()

    await sio.enter_room(sid, order_room(order_number))
    await sio.emit(
        "order:status",
        {"order_number": order_number, "status": current_status},
        to=sid,
    )
    return {"ok": True}


@sio.on("order:leave")
async def leave_order(sid, data):
    if isinstance(data, dict):
        order_number = data.get("order_number")
        if isinstance(order_number, str):
            await sio.leave_room(sid, order_room(order_number))