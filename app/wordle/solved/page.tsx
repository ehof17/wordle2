'use client'; 
import React, { useEffect, useState } from "react";

import { useLocalObservable, Observer } from "mobx-react-lite";
import PuzzleStore from "../../stores/PuzzleStore";
import UltimateBoard from '../../components/UltBoard';
import UltStore from "../../stores/UltStore";
import TitleScreen from '../../components/TitleScreen';

import { reaction } from 'mobx';

const WordlePage = () => {
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);
  const [all_stores_won, setAllStoresWon] = useState(false);
  const stores = useLocalObservable(() => [
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore(),
    new PuzzleStore()
  ]);
  const UltStory = useLocalObservable(() => new UltStore());
  const words = ['whish', 'feuds', 'motif', 'flaky', 'mogul'];
  
  useEffect(() => {
    UltStory.init();
    stores.forEach((store, index) => {
        store.init("")
    })
    stores.map((store, index) => {
        UltStory.words[index] = store.word;
        UltStory.wordsGrid[index] = Array(4).fill("").concat(store.word.split(''), Array(4).fill(""));
        UltStory.wordsGrid2[index] = Array(4).fill("").concat(store.word.split(''), Array(4).fill(""));
    });

  
    UltStory.MakeSolvable();
}, []);

  useEffect(() => {
    const handleKeyUp = (e) => {
        UltStory.handleKeyUp(e);
    
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeStoreIndex, stores, all_stores_won]);

  useEffect(() => {
    const disposers = stores.map(store =>
      reaction(
        () => store.won,
        () => {
          const allStoresWon = stores.every(store => store.won);
          if (allStoresWon) {
            setAllStoresWon(true);
          }
        }
      )
    );

    return () => {
      disposers.forEach(dispose => dispose());
    };
  }, [stores]);


  const switchGame = (index) => {
    setActiveStoreIndex(index);
  };

  const allStoresWon = stores.every(store => store.won);

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
        <div>
          { (
            <div className='flex items-center justify-evenly'>
              <TitleScreen />
              <UltimateBoard store={UltStory} />
            </div>
          ) }
        </div>
      </div>
    )}
  </Observer>
);
};

export default WordlePage;