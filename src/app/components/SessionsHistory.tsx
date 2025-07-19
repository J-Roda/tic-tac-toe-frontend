import { Session } from "../lib/types";
import Link from "next/link";

type SessionsHistoryProps = {
    sessions: Session[];
    handleDeleteSession: (id: string) => void;
};

const SessionsHistory = ({
    sessions,
    handleDeleteSession,
}: SessionsHistoryProps) => {
    return (
        <div className="flex flex-col items-center gap-5">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Game Sessions History </h1>
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
                                    ❌ Wins: {session.stats.player1Wins} | 🟢
                                    Wins: {session.stats.player2Wins}
                                </span>
                                <span>🤝 Draws: {session.stats.draws}</span>
                            </p>
                            <p>Totals Played: {session.rounds.length}</p>
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
    );
};
export default SessionsHistory;
