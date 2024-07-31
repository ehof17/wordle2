import React from 'react';

const MiniGrid = ({ boardState }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${boardState[0].length}, 1fr)` }}>
            {boardState.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                    <div 
                        key={`${rowIndex}-${colIndex}`} 
                        className={`h-5 w-5 border border-gray-400 text-white font-bold uppercase flex items-center justify-center bg-${cell.color}-400`}
                    >

                        {cell.letter}
                    </div>
                ))
            )}
        </div>
    );
};

export default MiniGrid;