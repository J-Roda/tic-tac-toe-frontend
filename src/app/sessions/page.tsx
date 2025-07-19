"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Session } from "../lib/types";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../components/Loading";
import SessionsHistory from "../components/SessionsHistory";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const GameSessions = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/api/session/all`)
            .then((res) => res.json())
            .then((data) => {
                setSessions(data);
                setIsLoading(false);
            });
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

    return isLoading ? (
        // <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loading />
    ) : (
        // </div>
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
                <SessionsHistory
                    sessions={sessions}
                    handleDeleteSession={handleDeleteSession}
                />
            )}

            <Link href="/new">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                    Start New Game
                </button>
            </Link>
        </div>
    );
};

export default GameSessions;
