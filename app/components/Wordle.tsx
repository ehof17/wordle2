'use client'; 
import { observer, useLocalObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import Querty from "./Querty";
import Guess from "./Guess";
import PuzzleStore from "../stores/PuzzleStore";

interface WordleProps {
  store: PuzzleStore; 
}
const Wordle = observer(({store}:WordleProps) => {

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-600">
      <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">Wordle</h1>
     
      
      {store.guesses.map((_, i) => (
    <Guess 
      key={i}
      word={store.word}
      guess={store.guesses[i]} 
      isGuessed={i < store.currentGuess}

    />
  ))}
      <Querty store = {store}/>
    </div>
  );
});

export default Wordle;
