'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const NavigationButtons: React.FC = () => {
  const router = useRouter();

  const handleSolveAll = () => {
    router.push('/wordle');
  };

  const handleEasyWayOut = () => {
    router.push('/wordle/solved');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className=''>Welcome to Wordle 5x5 </h1>
      <p className=''>Here you solve 5 Wordles and then based on those answers, solve the ULTIMATE WORDLE</p>
      <p className=''></p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={handleSolveAll}
      >
        GO
      </button>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded"
        onClick={handleEasyWayOut}
      >
        GO to Ultimate Wordle
      </button>
    </div>
  );
};

export default NavigationButtons;