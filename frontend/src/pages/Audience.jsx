
import { useCallback, useEffect, useState } from "react";
import { getCompetitionState } from "../services/api";
import { useCompetitionWebSocket } from "../services/websocket";

function Audience() {
    const [state, setState] = useState(null);
    const [error, setError] = useState("");

    const applyState = useCallback((nextState) => {
        setState(nextState);
    }, []);

    useCompetitionWebSocket("audience", applyState);

    useEffect(() => {
        let mounted = true;

        getCompetitionState()
            .then((data) => {
                if (mounted) {
                    // The judge endpoint includes the answer.
                    // Remove it before storing audience state.
                    if (data.question) {
                        data = {
                            ...data,
                            question: {
                                id: data.question.id,
                                question: data.question.question,
                            },
                        };
                    }

                    setState(data);
                }
            })
            .catch((err) => {
                if (mounted) {
                    setError(
                        err.message || "Could not connect to the competition."
                    );
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (!state) {
        return (
            <div className="audience-page">
                <p>{error || "Connecting to the live competition..."}</p>
            </div>
        );
    }

    const question = state.question;
    const result = state.result;
    const responder = state.responder;
    const scores = state.scores || { 1: 0, 2: 0 };
    const phase = state.phase;

    return (
        <div className="audience-page">
            <header className="audience-header">
                <div>
                    <span>LIVE QUIZ COMPETITION</span>

                    <h1>
                        {question
                            ? `Question ${state.question_number}`
                            : "Competition Finished"}
                    </h1>
                </div>

                <div className="live-indicator">
                    <span className="live-dot" />
                    LIVE
                </div>
            </header>

            <main className="audience-content">
                {error && (
                    <div className="audience-error" role="alert">
                        {error}
                    </div>
                )}

                <section className="audience-question">
                    <div className="section-label">QUESTION</div>

                    <h2>
                        {question?.question ||
                            "The quiz has ended. Thank you for participating."}
                    </h2>

                    {question && (
                        <p>
                            Question {state.question_number} of{" "}
                            {state.total_questions}
                        </p>
                    )}
                </section>

                <section className="audience-response">
                    <div className="section-label">FIRST RESPONSE</div>

                    <div className="audience-responder">
                        {responder !== null
                            ? `Contestant ${responder}`
                            : phase === "answering"
                              ? "Waiting for a response..."
                              : "No response yet"}
                    </div>
                </section>

                {result && (
                    <div
                        className={`audience-result ${
                            result === "correct" ? "correct" : "wrong"
                        }`}
                        role="status"
                    >
                        {result === "correct"
                            ? "RIGHT ANSWER!"
                            : "WRONG ANSWER!"}
                    </div>
                )}

                <section className="audience-scores">
                    <div>
                        <span>CONTESTANT 1</span>
                        <strong>{scores["1"] ?? 0}</strong>
                    </div>

                    <div>
                        <span>CONTESTANT 2</span>
                        <strong>{scores["2"] ?? 0}</strong>
                    </div>
                </section>

                <div className="audience-status">
                    {phase === "ready" && "Waiting for the next question to begin"}
                    {phase === "answering" && "BUZZERS ARE LIVE"}
                    {phase === "answered" && "Answer evaluated"}
                    {phase === "finished" && "COMPETITION FINISHED"}
                </div>
            </main>
        </div>
    );
}

export default Audience;
