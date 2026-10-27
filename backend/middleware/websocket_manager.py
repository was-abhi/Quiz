
from fastapi import WebSocket


class WebSocketManager:
    def __init__(self):
        self.connections = {
            "judge": set(),
            "audience": set(),
        }

    async def connect(self, websocket: WebSocket, view: str):
        await websocket.accept()
        self.connections[view].add(websocket)

    def disconnect(self, websocket: WebSocket, view: str):
        self.connections[view].discard(websocket)

    async def broadcast(self, states: dict):
        for view, connections in self.connections.items():
            message = states[view]

            for websocket in list(connections):
                try:
                    await websocket.send_json(message)
                except Exception:
                    self.disconnect(websocket, view)


websocket_manager = WebSocketManager()
