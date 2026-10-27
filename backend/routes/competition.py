
from fastapi import APIRouter, HTTPException, WebSocket
from pydantic import BaseModel

from services.competition import competition
from middleware.event_handler import process_device_message
from middleware.websocket_manager import websocket_manager

router = APIRouter(prefix="/api/competition", tags=["Competition"])


class EvaluationRequest(BaseModel):
    correct: bool


class MockResponseRequest(BaseModel):
    contestant: int


@router.get("/state")
async def get_state():
    return competition.judge_state()


@router.post("/start")
async def start_question():
    try:
        return await competition.start_question()
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error))


@router.post("/evaluate")
async def evaluate_answer(request: EvaluationRequest):
    try:
        return await competition.evaluate(request.correct)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error))


@router.post("/next")
async def next_question():
    try:
        return await competition.next_question()
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error))


# Development-only endpoint. Do not expose this in production.
@router.post("/dev/mock-response")
async def mock_response(request: MockResponseRequest):
    try:
        return await process_device_message(
            f"RESPONSE:{request.contestant}"
        )
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error))


@router.websocket("/ws/{view}")
async def competition_websocket(websocket: WebSocket, view: str):
    if view not in ("judge", "audience"):
        await websocket.close(code=1008)
        return

    await websocket_manager.connect(websocket, view)

    try:
        state = (
            competition.judge_state()
            if view == "judge"
            else competition.audience_state()
        )

        await websocket.send_json(state)

        while True:
            # Keep the connection open. State updates are server-pushed.
            await websocket.receive_text()

    except Exception:
        websocket_manager.disconnect(websocket, view)
