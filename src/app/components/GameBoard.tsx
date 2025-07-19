"use client";

type Props = {
    board: string[][];
    onCellClick: (row: number, col: number) => void;
};

export default function GameBoard({ board, onCellClick }: Props) {
    return (
        <div className="grid grid-cols-3 gap-2 w-60 mx-auto">
            {board.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                    <button
                        key={`${rowIdx}-${colIdx}`}
                        onClick={() => onCellClick(rowIdx, colIdx)}
                        className="w-20 h-20 text-2xl font-bold border rounded bg-white hover:bg-gray-100 cursor-pointer"
                        disabled={!!cell}
                    >
                        {cell}
                    </button>
                ))
            )}
        </div>
    );
}
