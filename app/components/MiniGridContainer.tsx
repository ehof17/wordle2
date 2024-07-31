import React from 'react';
import MiniGrid from './MiniGrid';

const MiniGridContainer = ({ guesses }) => {
    return (
        <div>
            {guesses.map((boardState, index) => (
                <MiniGrid key={index} boardState={boardState} />
            ))}
        </div>
    );
};

export default MiniGridContainer;