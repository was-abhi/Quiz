
from services.competition import competition


async def process_device_message(message: str):
    message = message.strip()

    if message == "RESET":
        competition.responder = None
        competition.result = None
        competition.point_awarded = False
        competition.phase = "ready"

        await competition.publish()
        return competition.judge_state()

    if message == "RESPONSE:1":
        return await competition.handle_response(1)

    if message == "RESPONSE:2":
        return await competition.handle_response(2)

    raise ValueError(f"Unknown device message: {message}")
