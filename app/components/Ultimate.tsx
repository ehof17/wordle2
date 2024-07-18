
import { observer } from "mobx-react-lite";
import Guess from "./Guess";

const Ultimate = observer(({stores}) => {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
        <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">Ultimate Wordle</h1>
        {stores.map((store, index) => (
          <div key={index}>
           
            
            <Guess
            word={store.word}
            guess={store.won ? store.word : store.guesses[store.currentGuess]} 
            isGuessed={store.won ? true : false}/>
           
          </div>
        ))}
      </div>
    );
  });
  export default Ultimate;