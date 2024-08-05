import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db,fetchScores } from '../lib/firebase';
import UltStore from '../stores/UltStore';
interface UltimateBoardProps {
    store: UltStore;
    scoresList: any;
  }
  
const EndScreen = ({ store,scoresList }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [name, setName] = useState('');
  const [canPlay, setCanPlay] = useState(true);
  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async () => {
    if (canPlay) {
      await store.submitScore(name);
      localStorage.setItem('lastPlayDate', new Date().toISOString().split('T')[0]);
      setIsVisible(false);
    }
    else{
        alert('You have already submitted your score for today');
    }
  };
  useEffect(() => {
    
   
    const lastPlayDate = localStorage.getItem('lastPlayDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastPlayDate === today) {
      setCanPlay(false);
    }
  }, []);
 

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
        <h1 className="text-2xl font-bold mb-4 text-gray-700">All Done Son</h1>
        <p className="text-left text-gray-700 mb-4">Your Score: {store.score}</p>
        <input
          type="text"
          className="border text-gray-700 border-gray-300 p-2 rounded w-full mb-4"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit Score
        </button>
        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-700">Today&apos;s Scores</h2>
          <ul className="text-left text-gray-700">
            {scoresList.map((score, index) => (
              <li key={index}>{score.name}: {score.score}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;