"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Loading from "../components/Loading";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewGamePage() {
    const router = useRouter();
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const createSession = async () => {
        setIsLoading(true);
        if (player1 === player2) {
            return toast.error("Players name must not be the same", {
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
        const res = await fetch(`${BASE_URL}/api/session/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player1, player2 }),
        });
        const data = await res.json();
        router.push(`/game/${data._id}`);
        setIsLoading(false);
    };

    const handlePlayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const name = e.target.name;

        if (value.length > 12) {
            setError("Name must be 12 characters or less");
        } else {
            setError("");
        }

        if (name === "player1") {
            setPlayer1(value);
        }
        if (name === "player2") {
            setPlayer2(value);
        }
    };

    return isLoading ? (
        <Loading />
    ) : (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-5">
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
            <h1 className="text-2xl font-bold">Start New Game</h1>
            <div className="w-64 text-center">
                <input
                    className="mb-2 px-4 py-2 border rounded"
                    placeholder="Player 1 Name ❌"
                    value={player1}
                    name="player1"
                    onChange={(e) => handlePlayerChange(e)}
                />
                {player1.length > 12 && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
            </div>
            <div className="w-64 text-center">
                <input
                    className="px-4 py-2 border rounded"
                    placeholder="Player 2 Name 🟢"
                    value={player2}
                    name="player2"
                    onChange={(e) => handlePlayerChange(e)}
                />
                {player2.length > 12 && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
            </div>
            <button
                onClick={createSession}
                disabled={
                    !player1 ||
                    !player2 ||
                    player1.length > 12 ||
                    player2.length > 12
                }
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                Start Game
            </button>
        </main>
    );
}
