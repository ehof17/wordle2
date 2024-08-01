import React from 'react';

const MiniGrid = ({ boardState }) => {
    // Initialize a default 5x13 grid if boardState is empty
    const defaultGrid = Array.from({ length: 5 }, () => 
        Array.from({ length: 13 }, () => ({ letter: '', color: '' }))
    );

    const grid = boardState.length > 0 ? boardState : defaultGrid;
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(13, 1fr)` }}>
            {grid.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                    <div 
                        key={`${rowIndex}-${colIndex}`} 
                        className={`h-5 w-5 ${cell.letter ? 'border border-gray-400' : ''} text-white font-bold uppercase flex items-center justify-center bg-${cell.color}-400`}
                    >
                        {cell.letter}
                    </div>
                ))
            )}
        </div>
    );
};

export default MiniGrid;