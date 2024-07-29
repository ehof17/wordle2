'use client'; 
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import React, { useEffect, useState } from "react";
import Wordle from "../components/Wordle";
import { useLocalObservable, Observer } from "mobx-react-lite";
import PuzzleStore from "../stores/PuzzleStore";
import UltimateBoard from '../components/UltBoard';
import UltStore from "../stores/UltStore";

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

  useEffect(() => {
    UltStory.init();
    stores.forEach(store => store.init());
    stores.map((store, index) => {
      UltStory.words[index] = store.word;
      UltStory.wordsGrid[index] = Array(4).fill("").concat(store.word.split(''), Array(4).fill(""));
    });
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

  return (
    <Observer>
      {() => (
        <div>
          <div className='flex items-center justify-evenly'>
            {stores.map((store, index) => (
              <button
                className={store.won ? "text-green-400" : "text-white-900"}
                key={`store-${index}`}
                onClick={() => switchGame(index)}
              >
                Game {index + 1}
              </button>
            ))}
          </div>
          <div className='flex items-center justify-evenly'>
            {UltStory.words.map((word, index) => (
              <button
                className={stores[index].won ? "text-green-400" : "text-white-900"}
                key={`word-${index}`}
                onClick={() => switchGame(index)}
              >
                {word}
              </button>
            ))}
          </div>
          {/*<Wordle store={stores[activeStoreIndex]} />*/}
          <div className='flex items-center justify-evenly'>
            <UltimateBoard store={UltStory} />
          </div>
        </div>
      )}
    </Observer>
  );
};

export default WordlePage;