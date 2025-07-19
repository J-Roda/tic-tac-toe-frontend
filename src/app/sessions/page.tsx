"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Session } from "../lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const GameSessions = () => {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/session/all`)
            .then((res) => res.json())
            .then((data) => setSessions(data));
    }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-300 flex flex-col items-center justify-center">
            {sessions.length === 0 ? (
                <p>No previous sessions yet.</p>
            ) : (
                <div className="flex flex-col items-center gap-5">
                    <h1 className="text-3xl font-bold mb-4">
                        Game Sessions History{" "}
                    </h1>
                    <div className="w-full max-w-2xl mx-auto h-[50vh] flex flex-col overflow-y-scroll border-2 border-gray-400 p-4 rounded bg-white">
                        <ul className="space-y-4">
                            {sessions.map((session) => (
                                <li
                                    key={session._id}
                                    className="bg-white p-4 rounded shadow"
                                >
                                    <p>
                                        <strong>❌ {session.player1}</strong> vs{" "}
                                        <strong>🟢 {session.player2}</strong>
                                    </p>
                                    <p>
                                        ❌ Wins: {session.stats.player1Wins} |
                                        🟢 Wins: {session.stats.player2Wins} |
                                        🤝 Draws: {session.stats.draws}
                                    </p>
                                    <p>
                                        Totals Played: {session.rounds.length}
                                    </p>
                                    <Link href={`/game/${session._id}`}>
                                        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                            Continue Game
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link href="/new">
                        <button className=" px-4 py-2 bg-blue-500 text-white rounded">
                            Start New Game
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};
export default GameSessions;
