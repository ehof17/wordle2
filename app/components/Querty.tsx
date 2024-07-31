import {observer} from 'mobx-react-lite'
import PuzzleStore from '../stores/PuzzleStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
interface QuertyProps {
    store: PuzzleStore; 
  }
  export default observer(function Querty({store}: QuertyProps) {
      const querty = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
      const handleLetterClick = (letter: string) => {
          if (store.won || store.lost){
              return;
          }
          if (store.guesses[store.currentGuess].length < 5 && letter.match(/^[A-z]$/)){
              store.guesses[store.currentGuess] += letter.toLowerCase();
          }
      }
  
      const handleSubmit = () => {
          store.submitGuess();
      };
      const handleBack = () => {
          store.guesses[store.currentGuess] = store.guesses[store.currentGuess].slice(
              0,
              store.guesses[store.currentGuess].length - 1
          )
      }
  
      return (
          <div>
              {querty.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center">
                    {rowIndex === querty.length - 1 && (
                          <>
                              <button className={`m-px h-10 w-20 rounded-md flex items-center justify-center uppercase bg-gray-400`} onClick={handleSubmit}>Enter</button>
                          </>
                      )}
                      {row.split('').map((letter, letterIndex) => {
                          const bgColor = store.exactGuesses.includes(letter)
                          ? 'bg-green-400'
                          : store.inexactGuesses.includes(letter)
                          ? 'bg-yellow-400'
                          : store.allGuesses.includes(letter)
                          ? 'bg-gray-800'
                          : 'bg-gray-400';
                          return (
                              <div key={`${rowIndex}-${letterIndex}`} className={`m-px w-10 h-10 ${bgColor} rounded-md flex items-center justify-center uppercase`} onClick={() => handleLetterClick(letter)}>
                                  {letter}
                              </div>
                          );
                      })}
                      {rowIndex === querty.length - 1 && (
                          <>
                              <button className={`m-px h-10 w-20 rounded-md flex items-center justify-center uppercase bg-gray-400`} onClick={handleBack}><FontAwesomeIcon icon={faBackspace} /></button>
                          </>
                      )}
                  </div>
              ))}
          </div>
      );
  });