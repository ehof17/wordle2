'use client'; 
import { observer, useLocalObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import Querty from "./Querty";
import Guess from "./Guess";
import PuzzleStore from "../stores/PuzzleStore";

const Wordle = observer(({store}) => {
  console.log(`store in Wordle: ${store}`)
  console.log(`store in Wordle: ${JSON.stringify(store)}`)
  
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
      <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">Wordle</h1>
      {store.won && <h1>You Won!</h1>}
      {store.lost && <h1>You Lost!</h1>}
      {(store.won || store.lost) && (
        <button onClick={store.init} className="p-4 bg-blue-500 text-white rounded-lg mt-4">
          Play Again
        </button>
      )}
      
      {store.guesses.map((_, i) => (
        <Guess 
        key={i}
        word ={store.word}
        guess={store.guesses[i]} 
        isGuessed={i < store.currentGuess}/>))
      }
      <Querty store = {store}/>
    word: {store.word}
    guesses: {JSON.stringify(store.guesses)}
    </div>
  );
});

export default Wordle;
