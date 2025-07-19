export type Session = {
    _id: string;
    player1: string | null;
    player2: string | null;
    rounds: { winner: string }[];
    stats: {
        player1Wins: number;
        player2Wins: number;
        draws: number;
    };
};

export type TURN = "❌" | "🟢";
