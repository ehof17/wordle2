
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
    // swap the values at the selected index and the index passed in
    swap(index){
        const temp = this.words[this.selected]
        console.log(this.words[this.selected], this.words[index])
        console.log(this.selected, index)
        this.words[this.selected] = this.words[index];
        this.words[index] = temp;

    }
    changeSelected(direction){
        if(direction == 'up'){
            if(this.selected == 0){
                this.selected = 4;
            }
            else{
                this.selected--;
            }
        }
        if(direction == 'down'){
            if (this.selected == 4){
                this.selected = 0
            }
            else{
                this.selected++;
            
            }
        }
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
       
        if (e.key === 'ArrowLeft'){
            return this.moveSelection('left');
        }
        if (e.key === 'ArrowRight'){
            return this.moveSelection('right');
        }
        if (e.key === 'ArrowDown'){
            return this.changeSelected('down');
        }
        if (e.key === 'ArrowUp'){
            return this.changeSelected('up');
        }

        if (e.key === 'Backspace'){
            console.log('aaayy')
           return this.swap(0)
        }
       
        

    }


}
export default UltStore;