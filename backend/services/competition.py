
from services.quiz_store import load_quiz, save_quiz
from middleware.websocket_manager import websocket_manager


class CompetitionService:
    def __init__(self):
        self.data = load_quiz()
        self.phase = "ready"
        self.responder = None
        self.result = None
        self.point_awarded = False

    def current_question(self):
        index = self.data["current_question"]
        questions = self.data["questions"]

        if index >= len(questions):
            return None

        return questions[index]

    def judge_state(self):
        question = self.current_question()

        return {
            "question": question,
            "question_number": self.data["current_question"] + 1,
            "total_questions": len(self.data["questions"]),
            "scores": self.data["scores"],
            "responder": self.responder,
            "result": self.result,
            "phase": self.phase,
        }

    def audience_state(self):
        state = self.judge_state().copy()

        if state["question"] is not None:
            state["question"] = {
                "id": state["question"]["id"],
                "question": state["question"]["question"],
            }

        return state

    async def publish(self):
        await websocket_manager.broadcast({
            "judge": self.judge_state(),
            "audience": self.audience_state(),
        })

    async def start_question(self):
        if self.phase == "finished":
            raise ValueError("The quiz has finished.")

        if self.current_question() is None:
            self.phase = "finished"
            raise ValueError("There are no more questions.")

        self.responder = None
        self.result = None
        self.point_awarded = False
        self.phase = "answering"

        await self.publish()
        return self.judge_state()

    async def handle_response(self, contestant: int):
        if contestant not in (1, 2):
            raise ValueError("Contestant must be 1 or 2.")

        if self.phase != "answering" or self.responder is not None:
            return self.judge_state()

        self.responder = contestant

        await self.publish()
        return self.judge_state()

    async def evaluate(self, correct: bool):
        if self.phase != "answering":
            raise ValueError("There is no active answer to evaluate.")

        if self.responder is None:
            raise ValueError("No contestant has responded yet.")

        if self.current_question() is None:
            raise ValueError("There is no current question.")

        if correct and not self.point_awarded:
            key = str(self.responder)
            self.data["scores"][key] += 1
            self.point_awarded = True
            save_quiz(self.data)

        self.result = "correct" if correct else "wrong"
        self.phase = "answered"

        await self.publish()
        return self.judge_state()

    async def next_question(self):
        if self.phase != "answered":
            raise ValueError("Evaluate the current answer first.")

        self.data["current_question"] += 1
        save_quiz(self.data)

        self.responder = None
        self.result = None
        self.point_awarded = False

        if self.current_question() is None:
            self.phase = "finished"
        else:
            self.phase = "ready"

        await self.publish()
        return self.judge_state()


competition = CompetitionService()
