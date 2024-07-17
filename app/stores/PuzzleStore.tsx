import { get } from "http";
import words from '../../../words.json';
import { makeAutoObservable } from "mobx";
class PuzzleStore {
    word= '';
    guesses= [];
    currentGuess= 0;
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
        console.log('init called')
        console.log(this.word)
        console.log(this.guesses)
        console.log(this.currentGuess)
        
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
        if (e.key === 'Enter'){
            return this.submitGuess();
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
export default PuzzleStore;