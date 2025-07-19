"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GameBoard from "@/app/components/GameBoard";
import confetti from "canvas-confetti";
import { Session, TURN } from "@/app/lib/types";
import GameHistory from "@/app/components/GameHistory";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GamePage() {
    const { id } = useParams();
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [board, setBoard] = useState<string[][]>([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);
    const [turn, setTurn] = useState<TURN>("❌");
    const [winner, setWinner] = useState<string>("");

    // 🧠 Check if someone won
    const checkWinner = (
        board: string[][],
        session: { player1: string | null; player2: string | null }
    ): string => {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (
                board[row][0] &&
                board[row][0] === board[row][1] &&
                board[row][0] === board[row][2]
            ) {
                if (board[row][0] === "❌") {
                    if (session.player1 !== null) return session.player1;
                } else {
                    if (session.player2 !== null) return session.player2;
                }
            }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (
                board[0][col] &&
                board[0][col] === board[1][col] &&
                board[0][col] === board[2][col]
            ) {
                if (board[0][col] === "❌") {
                    if (session.player1 !== null) return session.player1;
                } else {
                    if (session.player2 !== null) return session.player2;
                }
            }
        }

        // Check diagonals
        if (
            board[0][0] &&
            board[0][0] === board[1][1] &&
            board[0][0] === board[2][2]
        ) {
            if (board[0][0] === "❌") {
                if (session.player1 !== null) return session.player1;
            } else {
                if (session.player2 !== null) return session.player2;
            }
        }

        if (
            board[0][2] &&
            board[0][2] === board[1][1] &&
            board[0][2] === board[2][0]
        ) {
            if (board[0][2] === "❌") {
                if (session.player1 !== null) return session.player1;
            } else {
                if (session.player2 !== null) return session.player2;
            }
        }

        // Check draw (no empty cells)
        let isDraw = true;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!board[row][col]) {
                    isDraw = false;
                    break;
                }
            }
        }

        return isDraw ? "draw" : "";
    };

    const handleCellClick = async (row: number, col: number) => {
        if (board[row][col] || winner || !session) return;

        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = turn;
        setBoard(newBoard);

        const result = checkWinner(newBoard, session);

        if (result) {
            setWinner(result);

            // Update local session state
            setSession((prev) => {
                if (!prev) return prev;

                const updatedStats = { ...prev.stats };
                if (result === "draw") {
                    updatedStats.draws += 1;
                } else if (result === prev.player1) {
                    updatedStats.player1Wins += 1;
                } else if (result === prev.player2) {
                    updatedStats.player2Wins += 1;
                }
                return {
                    ...prev,
                    rounds: [...prev.rounds, { winner: result }],
                    stats: updatedStats,
                };
            });

            // Trigger confetti animation
            result !== "draw" && confetti();
            // Update backend with the winner
            try {
                await fetch(`${BASE_URL}/api/session/${id}/round`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        winner: result,
                    }),
                });
            } catch (err) {
                console.error("Failed to update backend:", err);
            }
        } else {
            setTurn(turn === "❌" ? "🟢" : "❌");
        }
    };

    const handleContinue = async () => {
        setBoard([
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ]);
        setTurn("❌");
        setWinner("");
    };

    const handleStop = async () => {
        await fetch(`${BASE_URL}/api/session/${id}/stop`, {
            method: "POST",
        });
        router.push("/");
    };

    const fetchSession = async () => {
        const res = await fetch(`${BASE_URL}/api/session/all`);
        const data = await res.json();
        const found = data.find((s: Session) => s._id === id);
        setSession(found || null);
    };

    useEffect(() => {
        fetchSession();
    }, [id]);

    return (
        <main className="min-h-screen p-4 bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Game Session</h1>
            {session && (
                <div className="bg-gray-500 p-6 shadow-md w-full max-w-5xl grid grid-cols-2 rounded-2xl gap-5">
                    <div className="col-span-2 md:col-span-1 flex flex-col items-center bg-gray-400 rounded-2xl p-4 gap-5">
                        <p>
                            <span className="font-bold text-lg">Turn: </span>
                            {turn === "❌"
                                ? `${session.player1} ❌`
                                : `${session.player2} 🟢`}
                        </p>

                        <GameBoard
                            board={board}
                            onCellClick={handleCellClick}
                        />

                        {winner ? (
                            <div className="text-center">
                                {winner === "draw" ? (
                                    <p>🤝 It's a Draw!</p>
                                ) : (
                                    <p>🎉 Winner: {winner}</p>
                                )}
                                <button
                                    onClick={handleContinue}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded mr-2 hover:bg-blue-700 cursor-pointer"
                                >
                                    Continue
                                </button>
                                <button
                                    onClick={handleStop}
                                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                                >
                                    Stop
                                </button>
                            </div>
                        ) : (
                            <div className="h-[72px]"></div>
                        )}
                    </div>
                    <div className="col-span-2 md:col-span-1 overflow-y-auto bg-gray-400 rounded-2xl flex flex-col items-center">
                        <div className="flex flex-col md:flex-row items-center justify-around gap-2  w-full max-w-2xl bg-gray-300 p-4 ">
                            <div className="flex flex-col items-center">
                                <h2>❌</h2>
                                <h3>{session?.player1}</h3>
                            </div>
                            <div className="flex flex-col items-center">
                                <h2 className="font-bold text-4xl">
                                    {session?.stats.player1Wins} :{" "}
                                    {session?.stats.player2Wins}
                                </h2>
                                <div className="flex gap-2">
                                    <h3>
                                        Draw: {session?.stats.draws} | Rounds:{" "}
                                        {session?.rounds.length}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <h2>🟢</h2>
                                <h3>{session?.player2}</h3>
                            </div>
                        </div>
                        <GameHistory session={session} />
                    </div>
                </div>
            )}
        </main>
    );
}
