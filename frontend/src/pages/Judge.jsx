
import { useCallback, useEffect, useState } from "react";
import {
    activateQuestion,
    resetQuestion,
    evaluateAnswer,
    nextQuestion,
    getCompetitionState,
} from "../services/api";
import { useCompetitionWebSocket } from "../services/websocket";


function Judge() {
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const applyState = useCallback((nextState) => {
        setState(nextState);
    }, []);

    useCompetitionWebSocket("judge", applyState);

    useEffect(() => {
        let mounted = true;

        getCompetitionState()
            .then((data) => {
                if (mounted) setState(data);
            })
            .catch((err) => {
                if (mounted) {
                    setError(err.message || "Could not load competition state.");
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    const performAction = async (action) => {
        setLoading(true);
        setError("");

        try {
            const updatedState = await action();
            setState(updatedState);
        } catch (err) {
            setError(
                err.message || "The requested action could not be completed."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!state) {
        return (
            <div className="judge-page">
                <p>{error || "Connecting to the competition server..."}</p>
            </div>
        );
    }

    const question = state.question;
    const phase = state.phase;
    const result = state.result;
    const responder = state.responder;
    const scores = state.scores || { 1: 0, 2: 0 };

    const canReset = phase !== "finished";
    const canActivate = phase === "ready" && question !== null;
    const canEvaluate = phase === "answering" && responder !== null;
    const canAdvance = phase === "answered";

    return (
        <div className="judge-page">
            <header className="judge-header">
                <div>
                    <h1>Quiz Competition</h1>
                    <p>Judge Control Panel</p>
                </div>

                <div className="question-number">
                    {question
                        ? `Question ${state.question_number} of ${state.total_questions}`
                        : "Competition finished"}
                </div>
            </header>

            <main className="judge-content">
                {error && (
                    <div className="judge-error" role="alert">
                        {error}
                    </div>
                )}

                <section className="quiz-section">
                    <div className="section-label">QUESTION</div>

                    <div className="question-box">
                        {question?.question || "No question available."}
                    </div>

                    <div className="section-label">ANSWER</div>

                    <div className="answer-box">
                        {question?.answer || "Unavailable"}
                    </div>
                </section>

                <section className="response-section">
                    <div className="section-label">CURRENT RESPONSE</div>

                    <div className="responder">
                        {responder !== null
                            ? `Contestant ${responder}`
                            : "No response yet"}
                    </div>

                    <div className="evaluation-buttons">
                        <button
                            className="right-button"
                            disabled={loading || !canEvaluate}
                            onClick={() =>
                                performAction(() => evaluateAnswer(true))
                            }
                        >
                            RIGHT
                        </button>

                        <button
                            className="wrong-button"
                            disabled={loading || !canEvaluate}
                            onClick={() =>
                                performAction(() => evaluateAnswer(false))
                            }
                        >
                            WRONG
                        </button>
                    </div>
                </section>

                <section className="score-section">
                    <div className="section-label">SCORE</div>

                    <div className="scores">
                        <div className="score">
                            <span>Contestant 1</span>
                            <strong>{scores["1"] ?? 0}</strong>
                        </div>

                        <div className="score">
                            <span>Contestant 2</span>
                            <strong>{scores["2"] ?? 0}</strong>
                        </div>
                    </div>
                </section>

                <div className="judge-actions">
                    <button
                        className="start-button"
                        disabled={loading || !canReset}
                        onClick={() =>
                            performAction(() => resetQuestion())
                        }
                    >
                        RESET QUESTION
                    </button>

                    <button
                        className="start-button"
                        disabled={loading || !canActivate}
                        onClick={() =>
                            performAction(() => activateQuestion())
                        }
                    >
                        ACTIVATE QUESTION
                    </button>

                    <button
                        className="next-button"
                        disabled={loading || !canAdvance}
                        onClick={() =>
                            performAction(() => nextQuestion())
                        }
                    >
                        NEXT QUESTION
                    </button>
                </div>

                <div className="judge-status">
                    Status: {phase.replaceAll("_", " ").toUpperCase()}
                </div>

                {result && (
                    <div className={`judge-result ${result}`}>
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
