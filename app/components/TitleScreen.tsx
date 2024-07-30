import React, { useState } from 'react';

const TitleScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white bg-opacity-70 p-6 rounded-lg w-11/12 max-w-lg text-center relative">
                <button 
                    className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
                    onClick={handleClose}
                >
                    X
                </button>
                <h1 className="text-2xl font-bold mb-4 text-gray-700 ">Welcome to the Ultimate Wordle</h1>
                <p className="text-left text-gray-700">
                    The aim is to make words out of words. First, try shifting the words to the left and right to get a word going down. 
                    If 3/5 letters match, it will be yellow, and 4/5 it will be orange. 5/5 it will be red. 
                    Once you get a column match, the lightning bolt is unlocked. This will allow you to move not only up and down but find a letter in any direction. 
                    It has to be touching the previous letter. Every straight up and down solution you get, you get another lightning bolt, 
                    meaning you can go not only to the letters that are touching but also letters that are 2 away if you get 2 column matches or 3 if etc.
                </p>
            </div>
        </div>
    );
};

export default TitleScreen;