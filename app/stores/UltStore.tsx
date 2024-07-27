
import { act } from 'react';
import words from '../../words.json';
import { makeAutoObservable, action } from "mobx";
import { match } from 'assert';
class TrieNode {
    children: {};
    isEndOfWord: boolean;
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    root: TrieNode;
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }
}
class UltStore {
    word= '';
    guesses= [];
    currentGuess= 0;
    words=[];
    solutions=[];
    solution ='?';
    words2=["Word1", "Word2", "Word3", "Word4", "Word5"];
    selected = 0;
    selectedIndexes = [0, 0, 0, 0, 0];
    startingIndexes = [4, 4, 4, 4, 4];
    yellowIDX = [[-1,-1]]
    redIDX = [[-1,-1]]
    orangeIDX = [[-1,-1]]
    letterLength = 5
    wordsGrid: string[][] = [
        ["","","","","a1", "a2", "a3", "a4", "a5","","","",""],
        ["","","","","b1", "b2", "b3", "b4", "b5","","","",""],
        ["","","","","c1", "c2", "c3", "c4", "c5","","","",""],
        ["","","","","d1", "d2", "d3", "d4", "d5","","","",""],
        ["","","","","e1", "e2", "e3", "e4", "e5","","","",""]
      ];


    
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
        this.solutions = new Array(6).fill('');
        this.currentGuess = 0;
        this.solution = '?';
     
        
    }
    // swap the values at the selected index and the index passed in
 
    changeSelected(direction){
        if(direction == 'up'){
            if(this.selected == 0){
                this.selected = 4;
            }
            else{
                this.selected--;
            }
            for (let col = 0; col < this.wordsGrid[0].length; col++) {
                for (let row = 0; row < this.wordsGrid.length - 1; row++) {
                  if (this.wordsGrid[row][col] === '' && this.wordsGrid[row + 1][col] !== '') {
                    this.wordsGrid[row][col] = this.wordsGrid[row + 1][col];
                    this.wordsGrid[row + 1][col] = '';
                  }
                }
              }

        }
        if(direction == 'down'){
            if (this.selected == 4){
                this.selected = 0
            }
            else{
                this.selected++;
            
            }
            for (let col = 0; col < this.wordsGrid[0].length; col++) {
                for (let row = this.wordsGrid.length - 1; row > 0; row--) {
                  if (this.wordsGrid[row][col] === '' && this.wordsGrid[row - 1][col] !== '') {
                    this.wordsGrid[row][col] = this.wordsGrid[row - 1][col];
                    this.wordsGrid[row - 1][col] = '';
                  }
                }
              }
        }
        this.checkForYellow()
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
            const row = this.wordsGrid[this.selected];
            const firstElement = row.shift();
            row.push(firstElement || '');
            this.wordsGrid[this.selected] = row;
            
        }
        if (direction === 'right'){
            const prevLoc = this.startingIndexes[this.selected];
            if(prevLoc === 8){
                this.startingIndexes[this.selected] =0;
            }
            else{
            this.startingIndexes[this.selected] +=1;
            }
            const row = this.wordsGrid[this.selected];
            const lastElement = row.pop();
            row.unshift(lastElement || '');
            this.wordsGrid[this.selected] = row;
        }
        this.checkForYellow()
    }
    submitGuess(){
        if (words.includes(this.guesses[this.currentGuess])){
            this.currentGuess++;
        }
       
    }
    handleKeyUp(e){
        console.log(this.word, this.guesses, this.currentGuess, e.key);
       
        if (e.key === 'a'){
            return this.moveSelection('left');
        }
        if (e.key === 'd'){
            return this.moveSelection('right');
        }
        if (e.key === 's'){
            return this.changeSelected('down');
        }
        if (e.key === 'w'){
            return this.changeSelected('up');
        }

        if (e.key === 'Backspace'){
            console.log('aaayy')
           return this.findSolution();
        }
        if (e.key === 'Enter'){
            return this.checkForYellow();
        }
   
       
        

    }
    findSolution(){
        this.solution = '?';
        this.solutions = [];
        const STARTINGLETTER = 0
        const STARTINGWORD = 0
        for (let q = 0; q < 5; q++){
        // For each letter in every word, check the other words and see if a letter matches a word in the given words.
        const firstLetter =this.words[STARTINGWORD][q];

        const wordsStartingWithFirstLetter = words.filter(word => new RegExp(`^${firstLetter}`, 'i').test(word));
       
        
        // If we have words that start here, we need to check every other letter in the other words
        for (let i = 0; i < 5; i++){
            const letterToCheck = this.words[STARTINGWORD + 1][i];
            const wordsStartingWithFirstTwoLetters = wordsStartingWithFirstLetter.filter(word => new RegExp(`^${firstLetter}${letterToCheck}`, 'i').test(word));

            if (wordsStartingWithFirstTwoLetters.length > 0){
                for (let j = 0; j < 5; j++){
                    const letterToCheck2 = this.words[STARTINGWORD + 2][j];
                    const wordsStartingWithFirstThreeLetters = wordsStartingWithFirstTwoLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}`, 'i').test(word));
                   

                    if (wordsStartingWithFirstThreeLetters.length > 0){
                        for (let k = 0; k < 5; k++){
                            const letterToCheck3 = this.words[STARTINGWORD + 3][k];
                            const wordsStartingWithFirstFourLetters = wordsStartingWithFirstThreeLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}${letterToCheck3}`, 'i').test(word));
                          
                           
                            if (wordsStartingWithFirstFourLetters.length > 0){
                                for (let l = 0; l < 5; l++){
                                    const letterToCheck4 = this.words[STARTINGWORD + 4][l];
                                    const wordsStartingWithFirstFiveLetters = wordsStartingWithFirstFourLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}${letterToCheck3}${letterToCheck4}`, 'i').test(word));
                                    
                                  
                                    if (wordsStartingWithFirstFiveLetters.length > 0){
                                        this.solution = wordsStartingWithFirstFiveLetters[0];
                                        this.solutions = this.solutions.concat(wordsStartingWithFirstFiveLetters);
                                    }
                                }
                            }
                        }
                      
                    }



                }
            }
          

    }
}
}
checkForYellow(){
    const yellowIDX = [];
    this.redIDX = [];
    this.yellowIDX = [];
    this.orangeIDX = [];
    for (let i = 0; i < this.letterLength; i++){
        const letterToCheck = this.words[0][i];
        const trueIndex = i + this.startingIndexes[0];
        const solutionsThatStartWithIt = this.solutions.filter(word => new RegExp(`^${letterToCheck}`, 'i').test(word));
        const possibleNextLetters =solutionsThatStartWithIt.map(word => word[1])
        const swag = this.yellowHelper(possibleNextLetters, letterToCheck, trueIndex, this.startingIndexes[0], 1, [[0, i]]);
        
    }
    //this.yellowIDX = yellowIDX;
}
yellowHelper(possibleNextLetters, letterToCheck, trueIndex, startingIndex, wordIndex, matchedIndexes=[]){
    console.log(`length of matchedLetters = ${matchedIndexes.length}`)
    // console.log(`Inside yellow helper searching for these letters ${possibleNextLetters}`)
    // console.log(`Letter to check ${letterToCheck}`)
    // console.log(`True index ${trueIndex}`)
    // console.log(`Starting index ${startingIndex}`)
    // console.log(`Word index ${wordIndex}`)
    if (this.solutions.includes(letterToCheck)){
        console.log(`Solution included ${letterToCheck}`)
        return;
    }
    if (possibleNextLetters.length > 0){
        let startingidxes=[];
        let matchedIndexes2 = [];
        for (let i = 0; i < 5; i++){
            const trueIndex2 = i + this.startingIndexes[wordIndex];
            const letterToCheck2 = this.words[wordIndex][i];
            // console.log(`Found new letter ${letterToCheck2} and its true index is ${trueIndex2}`)
            // console.log(`gotta ensure that it is in possibleNextLetters and that the true index is the same`)
            // console.log(possibleNextLetters, trueIndex)
            if (possibleNextLetters.includes(letterToCheck2) && trueIndex == trueIndex2){
             //   console.log(`We have a match ${letterToCheck2} is in possible next letters`)
                if (!matchedIndexes.some(([yRow, yCol]) => yRow === wordIndex && yCol === i)) {
                    console.log(`we pushing. ${matchedIndexes}`)
                    console.log(`we are pushing ${wordIndex} and ${i}`)
                    matchedIndexes.push([wordIndex, i]);
                }
                else{
                    console.log(`we are not pushing. ${matchedIndexes}`)
                }
              
              
                const solutionsThatStartWithIt = this.solutions.filter(word => new RegExp(`^${letterToCheck}${letterToCheck2}`, 'i').test(word));
                if (this.solutions.includes(`${letterToCheck}${letterToCheck2}`)){
                   
                    this.redIDX = (matchedIndexes);
                    
                }
              //  console.log(`here are the words that start with the letters ${letterToCheck}${letterToCheck2} ${solutionsThatStartWithIt}`)
                const possibleNextLetters2 = solutionsThatStartWithIt.map(word => word[wordIndex +1]);
                const returnedIndexes = this.yellowHelper(possibleNextLetters2, `${letterToCheck}${letterToCheck2}`, trueIndex2, startingIndex, wordIndex + 1, matchedIndexes);
                matchedIndexes = Array.from(new Set(matchedIndexes.concat(returnedIndexes)));
            }
            else if (matchedIndexes.length ===this.letterLength-2){
                console.log(`We have a yellow match ${matchedIndexes}`)
                const prevYellow = this.yellowIDX;
                this.yellowIDX = Array.from(new Set(matchedIndexes.concat(prevYellow)));
            }
            else if (matchedIndexes.length ===this.letterLength-1){
                console.log(`We ave a yellow match ${matchedIndexes}`)
                const prevOrange = this.orangeIDX;
                this.orangeIDX = Array.from(new Set(matchedIndexes.concat(prevOrange)));
            }
         
        }
        return matchedIndexes;
    }
    return [];
}
submitCol(){
    console.log('please')
    if (this.redIDX.length < this.letterLength){
        return;
    }
    const wordsCopy = this.words.map(innerArray => [...innerArray]);
    const  redIDXCopy =[...this.redIDX];
    console.log('help me')
    for (let [row, col] of redIDXCopy){
        console.log(`Row ${row} and col ${col}`)
        const numsToMove = -(col-(this.letterLength-1))
        const preNumsToKeep = this.words[row].slice(0, this.letterLength - numsToMove-1);
        const numsToMoveBack = this.words[row].slice(this.letterLength - numsToMove);
        wordsCopy[row] = preNumsToKeep.concat(numsToMoveBack);
        
        
        
    }
    
    this.words = wordsCopy;
    this.letterLength--;
    this.checkForYellow();
    
}
    findSolution2(){
        // Initialize the trie and insert all words
        const trie = new Trie();
        for (let word of this.words) {
            trie.insert(word);
        }
    
        // Check each word in your list
        for (let word of this.words) {
            if (trie.search(word)) {
                console.log(`Found word: ${word}`);
            }
        }
    }
    swap(index){
       
        const selectedIndex = this.selected;
        const wordsCopy = [...this.words];// create a copy of the words array
        wordsCopy[selectedIndex] = wordsCopy[index]; // swap the elements
        wordsCopy[index] = this.words[selectedIndex];
        this.words = wordsCopy;
        this.selected = index;
        this.findSolution();
        this.checkForYellow();

    }

}
export default UltStore;