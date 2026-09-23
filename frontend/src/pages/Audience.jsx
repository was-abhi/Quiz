import { useState } from "react";

function Audience() {
    const [questionNumber, setQuestionNumber] = useState(1);

    const [question, setQuestion] = useState(
        "What is the capital of France?"
    );

    const [firstResponder, setFirstResponder] = useState(1);
    const [result, setResult] = useState(null);

    const [scores, setScores] = useState({
        1: 0,
        2: 0,
    });

    const simulateJudgeDecision = (isCorrect) => {
        setResult(isCorrect ? "correct" : "wrong");

        if (isCorrect) {
            setScores((prev) => ({
                ...prev,
                [firstResponder]:
                    prev[firstResponder] + 10,
            }));
        }
    };

    const nextQuestion = () => {
        const nextNumber = questionNumber + 1;

        setQuestionNumber(nextNumber);

        const responder =
            nextNumber % 2 === 1 ? 1 : 2;

        setFirstResponder(responder);
        setResult(null);

        setQuestion(
            nextNumber % 2 === 1
                ? "What is the capital of France?"
                : "Which language is used to create web pages?"
        );
    };

    return (
        <div className="audience-page">

            <header className="audience-header">

                <div>
                    <span>LIVE QUIZ COMPETITION</span>
                    <h1>Question {questionNumber}</h1>
                </div>

                <div className="live-indicator">
                    ● LIVE
                </div>

            </header>

            <main className="audience-content">

                <section className="audience-question">

                    <div className="section-label">
                        QUESTION
                    </div>

                    <h2>{question}</h2>

                </section>

                <section className="audience-response">

                    <div className="section-label">
                        FIRST RESPONSE
                    </div>

                    <div className="audience-responder">
                        Contestant {firstResponder}
                    </div>

                </section>

                {result && (
                    <div
                        className={
                            result === "correct"
                                ? "audience-result correct"
                                : "audience-result wrong"
                        }
                    >
                        {result === "correct"
                            ? "RIGHT ANSWER!"
                            : "WRONG ANSWER!"}
                    </div>
                )}

                <section className="audience-scores">

                    <div>
                        <span>CONTESTANT 1</span>
                        <strong>{scores[1]}</strong>
                    </div>

                    <div>
                        <span>CONTESTANT 2</span>
                        <strong>{scores[2]}</strong>
                    </div>

                </section>

                {/* Temporary development controls.
                    These will disappear when WebSocket
                    communication is connected. */}

                <div className="dev-controls">

                    <button
                        onClick={() =>
                            simulateJudgeDecision(true)
                        }
                    >
                        Simulate RIGHT
                    </button>

                    <button
                        onClick={() =>
                            simulateJudgeDecision(false)
                        }
                    >
                        Simulate WRONG
                    </button>

                    <button onClick={nextQuestion}>
                        Next Question
                    </button>

                </div>

            </main>
        </div>
    );
}

export default Audience;