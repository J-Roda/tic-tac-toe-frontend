"use client";

import { Session } from "../lib/types";

type SessionHistoryProps = {
    session: Session | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SessionHistory = ({ session }: SessionHistoryProps) => {
    return (
        <ul className=" overflow-y-auto h-[60%] w-full md:w-96 mt-4 hidden md:block">
            {session?.rounds.map((round, index: number) => (
                <li key={index} className="bg-white p-4 rounded shadow mt-4">
                    <p>
                        Round {index + 1}:{" "}
                        {round?.winner !== "draw"
                            ? `Winner: ${round.winner}`
                            : "DRAW!"}
                    </p>
                </li>
            ))}
        </ul>
        // </>
    );
};
export default SessionHistory;
