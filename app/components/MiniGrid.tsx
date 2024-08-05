import { transaction } from 'mobx';
import React from 'react';

const MiniGrid = ({ boardState }) => {
    // Initialize a default 5x13 grid if boardState is empty
    const defaultGrid = Array.from({ length: 5 }, () => 
    [    
  ...Array.from({ length: 4 }, () => ({ letter: '', color: '' })),
  ...Array.from({ length: 5 }, () => ({ letter: '_', color: '' })),
  ...Array.from({ length: 4 }, () => ({ letter: '', color: '' }))
]
    );

    const grid = boardState.length > 0 ? boardState : defaultGrid;

    // Define a mapping of colors to Tailwind CSS classes
    const colorClasses = {
        red: 'guess-anim-red',
        green: 'bg-green-400',
        blue: 'bg-blue-400',
        yellow: 'guess-anim-yellow',
        orange: 'guess-anim-orange',
        // Add other colors as needed
    };
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(13, 1fr)` }}>
            {grid.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                    <div 
                        key={`${rowIndex}-${colIndex}`} 
                        className={`h-5 w-5 ${cell.letter ? 'border border-gray-400' : ''} text-white font-bold uppercase flex items-center justify-center  ${colorClasses[cell.color] || ''}`}
                        style={{ transition: 'animation 1s ease-in-out', animationDelay: `${rowIndex * .1}s` }}
                    >
                        {cell.letter}
                    </div>
                ))
            )}
        </div>
    );
};

export default MiniGrid;