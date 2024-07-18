
import words from '../../words.json';
import { makeAutoObservable } from "mobx";
class UltStore {
    word= '';
    guesses= [];
    currentGuess= 0;
    words=[];
    selectedIndexes = [0, 0, 0, 0, 0];
    startingIndexes = [4, 4, 4, 4, 4];
    
   constructor() {
        makeAutoObservable(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
       
    }


    get won(){
        return this.guesses[this.currentGuess-1] === this.word;
    }

    get lost(){
        return this.currentGuess === 6;
    }

    get allGuesses(){ 
        return this.guesses.slice(0, this.currentGuess).join("").split("");
    }

    get exactGuesses(){
        return(
            this.word
            .split('')
            .filter((letter, i) => {
                return this.guesses
                .slice(0, this.currentGuess)
                .map((word) => word[i])
                .includes(letter);
            }
        ))
    }

    get inexactGuesses(){
        return this.word
        .split('')
        .filter((letter)=> this.allGuesses.includes(letter))

    }

    init(){
        this.word = words[Math.floor(Math.random() * words.length)];
        this.guesses = new Array(6).fill('');
        this.currentGuess = 0;
     
        
    }
    moveSelection(direction){
        if (direction === 'left'){
            this.currentGuess = Math.max(0, this.currentGuess - 1);
        }
        if (direction === 'right'){
            this.currentGuess = Math.min(5, this.currentGuess + 1);
        }
    }
    submitGuess(){
        if (words.includes(this.guesses[this.currentGuess])){
            this.currentGuess++;
        }
       
    }
    handleKeyUp(e){
        console.log(this.word, this.guesses, this.currentGuess, e.key);
        if (this.won || this.lost){
        return;
    }
        if (e.key === 'ArrowDown'){
            return this.moveSelection('left');
        }
        if (e.key === 'ArrowUp'){
            return this.moveSelection('right');
        }
        if (e.key === 'Backspace'){
            this.guesses[this.currentGuess] = this.guesses[this.currentGuess].slice(
              0,
              this.guesses[this.currentGuess].length - 1
            );
            return;
        }
        if (this.guesses[this.currentGuess].length < 5 && e.key.match(/^[A-z]$/)){
            this.guesses[this.currentGuess] += e.key.toLowerCase();
        }
        

    }


}
export default UltStore;