
import { useEffect } from "react";

const WS_BASE = "ws://127.0.0.1:8000/api/competition/ws";

export function useCompetitionWebSocket(view, onMessage) {
    useEffect(() => {
        const socket = new WebSocket(`${WS_BASE}/${view}`);

        socket.onmessage = (event) => {
            try {
                onMessage(JSON.parse(event.data));
            } catch (error) {
                console.error("Invalid WebSocket message:", error);
            }
        };

        socket.onerror = () => {
            console.error("Competition WebSocket connection error.");
        };

        return () => {
            socket.close();
        };
    }, [view, onMessage]);
}
