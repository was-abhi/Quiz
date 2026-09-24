import { useState } from "react";

function Judge() {
    const [questionNumber, setQuestionNumber] = useState(1);

    const [question, setQuestion] = useState(
        "What is the capital of France?"
    );

    const [answer, setAnswer] = useState("Paris");

    // Contestant currently answering
    const [currentResponder, setCurrentResponder] = useState(1);

    // null = no decision yet
    // "correct" = current responder was marked correct
    // "wrong" = current responder was marked wrong
    const [result, setResult] = useState(null);

    // Who received the point for this question
    const [pointAwardedTo, setPointAwardedTo] = useState(null);

    const [scores, setScores] = useState({
        1: 0,
        2: 0,
    });

    // Start the question.
    // For now, first response alternates between contestants.
    const startQuestion = () => {
        const responder = questionNumber % 2 === 1 ? 1 : 2;

        setCurrentResponder(responder);
        setResult(null);
        setPointAwardedTo(null);
    };

    const evaluateAnswer = (isCorrect) => {
        if (isCorrect) {
            // If this question has already awarded a point,
            // do nothing. A question can only give 1 point.
            if (pointAwardedTo !== null) {
                return;
            }

            setScores((prev) => ({
                ...prev,
                [currentResponder]:
                    prev[currentResponder] + 1,
            }));

            setPointAwardedTo(currentResponder);
            setResult("correct");

        } else {
            // If the current responder previously got the point,
            // retract that point.
            if (pointAwardedTo !== null) {
                setScores((prev) => ({
                    ...prev,
                    [pointAwardedTo]:
                        prev[pointAwardedTo] - 1,
                }));

                setPointAwardedTo(null);
            }

            setResult("wrong");

            // Give the other contestant a chance.
            const nextResponder =
                currentResponder === 1 ? 2 : 1;

            setCurrentResponder(nextResponder);
        }
    };

    const nextQuestion = () => {
        const nextNumber = questionNumber + 1;

        setQuestionNumber(nextNumber);

        const responder =
            nextNumber % 2 === 1 ? 1 : 2;

        setCurrentResponder(responder);

        setResult(null);
        setPointAwardedTo(null);

        setQuestion(
            nextNumber % 2 === 1
                ? "What is the capital of France?"
                : "Which language is used to create web pages?"
        );

        setAnswer(
            nextNumber % 2 === 1
                ? "Paris"
                : "HTML"
        );
    };

    return (
        <div className="judge-page">

            <header className="judge-header">
                <div>
                    <h1>Quiz Competition</h1>
                    <p>Judge Control Panel</p>
                </div>

                <div className="question-number">
                    Question {questionNumber}
                </div>
            </header>

            <main className="judge-content">

                <section className="quiz-section">

                    <div className="section-label">
                        QUESTION
                    </div>

                    <div className="question-box">
                        {question}
                    </div>

                    <div className="section-label">
                        ANSWER
                    </div>

                    <div className="answer-box">
                        {answer}
                    </div>

                </section>


                <section className="response-section">

                    <div className="section-label">
                        CURRENT RESPONSE
                    </div>

                    <div className="responder">
                        Contestant {currentResponder}
                    </div>

                    <div className="evaluation-buttons">

                        <button
                            className="right-button"
                            onClick={() =>
                                evaluateAnswer(true)
                            }
                        >
                            RIGHT
                        </button>

                        <button
                            className="wrong-button"
                            onClick={() =>
                                evaluateAnswer(false)
                            }
                        >
                            WRONG
                        </button>

                    </div>

                </section>


                <section className="score-section">

                    <div className="section-label">
                        SCORE
                    </div>

                    <div className="scores">

                        <div className="score">
                            <span>
                                Contestant 1
                            </span>

                            <strong>
                                {scores[1]}
                            </strong>
                        </div>

                        <div className="score">
                            <span>
                                Contestant 2
                            </span>

                            <strong>
                                {scores[2]}
                            </strong>
                        </div>

                    </div>

                </section>


                <div className="judge-actions">

                    <button
                        className="start-button"
                        onClick={startQuestion}
                    >
                        START QUESTION
                    </button>

                    <button
                        className="next-button"
                        onClick={nextQuestion}
                    >
                        NEXT QUESTION
                    </button>

                </div>


                {result && (
                    <div
                        className={`judge-result ${result}`}
                    >
                        {result === "correct"
                            ? "RIGHT ANSWER!"
                            : "WRONG ANSWER!"}
                    </div>
                )}

            </main>
        </div>
    );
}

export default Judge;