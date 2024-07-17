import { observer } from "mobx-react-lite";
import Guess from "./Guess";

const Ultimate = observer(({stores}) => {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
        <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">Wordle</h1>
        {stores.map((store, index) => (
          <div key={index}>
            {store.won && <h1>You Won Game {index + 1}!</h1>}
            {store.lost && <h1>You Lost Game {index + 1}!</h1>}
            {(store.won || store.lost) && (
              <button onClick={store.init} className="p-4 bg-blue-500 text-white rounded-lg mt-4">
                Play Again Game {index + 1}
              </button>
            )}
            <Guess
            word={store.word}
            guess={store.won ? store.word : store.guesses[store.currentGuess]} 
            isGuessed={false}/>
            
            word: {store.word}
            guesses: {JSON.stringify(store.guesses)}
          </div>
        ))}
      </div>
    );
  });
  export default Ultimate;