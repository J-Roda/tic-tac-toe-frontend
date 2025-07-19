"use client";

import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen p-6 bg-gray-300 flex flex-col items-center justify-center gap-5 flex-wrap">
            <h1 className="text-3xl font-bold ">Welcome to Tic Tac Toe Game</h1>
            <Link href="/new">
                <button className=" px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 cursor-pointer">
                    Start New Game
                </button>
            </Link>
            <Link href="/sessions" className="items-center">
                <button className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 cursor-pointer">
                    Game History
                </button>
            </Link>
        </main>
    );
}
