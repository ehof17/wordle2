import React from 'react';
import MiniGrid from './MiniGrid';

const MiniGridContainer = ({ guesses }) => {
    const emptyGrids = Array(Math.max(0, 6 - guesses.length)).fill([]);

    return (
        <div className="grid grid-cols-3 gap-4">
            {[...guesses, ...emptyGrids].map((boardState, index) => (
                <MiniGrid key={index} boardState={boardState} />
            ))}
        </div>
    );
};

export default MiniGridContainer;