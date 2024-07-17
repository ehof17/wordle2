'use client'; 
import Link from 'next/link';
import {usePathname} from 'next/navigation';


import React, { useEffect, useState } from "react";
import Wordle from "../components/Wordle";
import { useLocalObservable, useObserver } from "mobx-react-lite";
import PuzzleStore from "../stores/PuzzleStore";
import exp from 'constants';
import Ultimate from '../components/Ultimate';





const WordlePage = () => {
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);
  const stores = useLocalObservable(() => [
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore()
  ]);
  useEffect(() => {
    stores.forEach(store => store.init());
  }, []);
  useEffect(() => {
    

    const handleKeyUp = (e) => {
      stores[activeStoreIndex].handleKeyUp(e);
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeStoreIndex, stores]);

   const switchGame = (index) => {
    setActiveStoreIndex(index);
  };

  return useObserver(() => (
    <div>
      <div className='flex items-center justify-evenly'>
        {stores.map((store, index) => (
          <button className={store.won ? "text-slate-400" : "text-slate-900"} key={index} onClick={() => switchGame(index)}>
            Game {index + 1}
          </button>
        ))}
      </div>

      <div className='flex items-center justify-evenly'>
        <Ultimate stores={stores} />
      </div>
      <Wordle store={stores[activeStoreIndex]} />
    </div>
  ));
};
export default WordlePage;
  