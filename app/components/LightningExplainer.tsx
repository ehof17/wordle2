import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db,fetchScores } from '../lib/firebase';
import UltStore from '../stores/UltStore';
interface UltimateBoardProps {
    store: UltStore;
    scoresList: any;
  }
  
const LightningExplainer = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [name, setName] = useState('');
  const [canPlay, setCanPlay] = useState(true);
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
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Great Job!</h1>
        <h2 className="text-xl font-bold mb-4 text-gray-700">You won for the day</h2>
        <h3 className="text-gray-700 mb-4">But its not over yet!</h3>
        <p className="text-gray-700 mb-4">Aim for a high score</p>
        <p className="text-gray-700 mb-4">Use lightning to connect letters in all directions</p>
        <p className="text-gray-700 mb-4">Find another word straight down to get a double lightning move</p>
        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-700">Today&apos;s Scores</h2>
          
        </div>
      </div>
    </div>
  );
};

export default LightningExplainer;