'use client'; 
import Link from 'next/link';
import {usePathname} from 'next/navigation';


import React, { useEffect, useState } from "react";
import Wordle from "../components/Wordle";
import { useLocalObservable, useObserver } from "mobx-react-lite";
import PuzzleStore from "../stores/PuzzleStore";
import exp from 'constants';
import Ultimate from '../components/Ultimate';
import UltStore from "../stores/UltStore";
import UltimateBoard from '../components/UltBoard';




const WordlePage = () => {
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);
  const stores = useLocalObservable(() => [
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore()
  ]);
  const UltStory = useLocalObservable(() => new UltStore());
  UltStory.init();
  useEffect(() => {
    stores.forEach(store => store.init());
  }, []);
  useEffect(() => {
    

    const handleKeyUp = (e) => {
      UltStory.handleKeyUp(e);
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
          UltStory.words[index] = store.word,
          <button className={store.won ? "text-green-400" : "text-white-900"} key={index} onClick={() => switchGame(index)}>
            Game {index + 1}
          </button>
        ))}
      </div>
      <div className='flex items-center justify-evenly'>
        {UltStory.words.map((store, index) => (
          <button className={store.won ? "text-green-400" : "text-white-900"} key={index} onClick={() => switchGame(index)}>
            {store}
          </button>
         
        ))}
      </div>

      
      <Wordle store={stores[activeStoreIndex]} />
      <div className='flex items-center justify-evenly'>
   
      <UltimateBoard store = {UltStory}/>
      </div>
    </div>
  ));
};
export default WordlePage;
  