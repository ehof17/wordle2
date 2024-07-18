
import words from '../../words.json';
import { makeAutoObservable } from "mobx";
class UltStore {
    word= '';
    guesses= [];
    currentGuess= 0;
    words=[];
    selected = 0;
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
            const prevLoc = this.startingIndexes[this.selected];
            if (prevLoc === 0){
                this.startingIndexes[this.selected] =8;
            }
            else{
                this.startingIndexes[this.selected] -=1;
            }
            
        }
        if (direction === 'right'){
            const prevLoc = this.startingIndexes[this.selected];
            if(prevLoc === 8){
                this.startingIndexes[this.selected] =0;
            }
            else{
            this.startingIndexes[this.selected] +=1;
            }
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
        if (e.key === 'ArrowLeft'){
            return this.moveSelection('left');
        }
        if (e.key === 'ArrowRight'){
            return this.moveSelection('right');
        }
        if (e.key === 'ArrowDown'){
            console.log('FOR THE LOVE OF GAWD JUST GO DOWN')
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