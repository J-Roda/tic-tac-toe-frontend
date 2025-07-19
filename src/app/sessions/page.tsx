"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Session } from "../lib/types";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const GameSessions = () => {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/session/all`)
            .then((res) => res.json())
            .then((data) => setSessions(data));
    }, []);

    const handleDeleteSession = async (id: string) => {
        console.log("heelo");
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `This session ${id} will be deleted permanently.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            const res = await fetch(`${BASE_URL}/api/session/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setSessions((prevSessions) =>
                    prevSessions.filter((session) => session._id !== id)
                );
                console.log(`${id} has been deleted successfully`);
                toast.success(`${id} has been deleted successfully`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                console.log(`Failed to delete session ${id}`);
                console.error(res);
                toast.error(`${res}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-300 flex flex-col items-center justify-center gap-5">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
            {sessions.length === 0 ? (
                <p>No previous sessions yet.</p>
            ) : (
                <div className="flex flex-col items-center gap-5">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">
                            Game Sessions History{" "}
                        </h1>
                        <h3>Total: {sessions ? sessions.length : 0}</h3>
                    </div>
                    <div className="w-full max-w-2xl mx-auto h-[50vh] flex flex-col overflow-y-scroll overflow-x-hidden border-2 border-gray-400 p-4 rounded bg-white  flex-wrap">
                        <ul className="space-y-4">
                            {sessions.map((session) => (
                                <li
                                    key={session._id}
                                    className="bg-white p-4 rounded shadow flex flex-col items-center gap-2"
                                >
                                    <p className="flex flex-col items-center md:block">
                                        <strong>❌ {session.player1}</strong> vs{" "}
                                        <strong>🟢 {session.player2}</strong>
                                    </p>
                                    {/* desktop */}
                                    <p className="hidden flex-col items-center md:flex">
                                        <span></span>❌ Wins:{" "}
                                        {session.stats.player1Wins} | 🟢 Wins:{" "}
                                        {session.stats.player2Wins} | 🤝 Draws:{" "}
                                        {session.stats.draws}
                                    </p>

                                    {/* mobile */}
                                    <p className="flex flex-col items-center md:hidden gap-1">
                                        <span>
                                            ❌ Wins: {session.stats.player1Wins}{" "}
                                            | 🟢 Wins:{" "}
                                            {session.stats.player2Wins}
                                        </span>
                                        <span>
                                            🤝 Draws: {session.stats.draws}
                                        </span>
                                    </p>
                                    <p>
                                        Totals Played: {session.rounds.length}
                                    </p>
                                    <div className="flex gap-5">
                                        <Link href={`/game/${session._id}`}>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                                Continue Game
                                            </button>
                                        </Link>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                                            onClick={() =>
                                                handleDeleteSession(session._id)
                                            }
                                        >
                                            Delete Game
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <Link href="/new">
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                    Start New Game
                </button>
            </Link>
        </div>
    );
};

export default GameSessions;
