import socketio

# Serveur Socket.io : chaque écran rejoint la "room" d'une commande pour suivre son statut
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=["http://localhost:5173"])


@sio.on("order:join")
async def join_order(sid, data):
    await sio.enter_room(sid, data["order_number"])


@sio.on("order:leave")
async def leave_order(sid, data):
    await sio.leave_room(sid, data["order_number"])


async def send_order_status(order_number: str, status: str):
    """Prévient tous les écrans qui suivent cette commande que son statut a changé."""
    await sio.emit("order:status", {"order_number": order_number, "status": status}, room=order_number)