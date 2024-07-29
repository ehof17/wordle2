
import { act } from 'react';
import words from '../../words.json';
import { makeAutoObservable, action, toJS } from "mobx";
import { match } from 'assert';
import next from 'next';
class TrieNode {
    children: {};
    isWord: boolean;
    refs: number;
    constructor() {
        this.children = {};
        this.isWord = false;
        this.refs = 0;
    }

    /**
     * @param {string} word
     */
    addWord(word) {
        let cur = this;
        cur.refs++;
        for (const c of word) {
            if (!cur.children[c]) {
                cur.children[c] = new TrieNode();
            }
            cur = cur.children[c];
            cur.refs++;
        }
        cur.isWord = true;
    }

    /**
     * @param {string} word
     */
    removeWord(word) {
        let cur = this;
        cur.refs--;
        for (const c of word) {
            if (cur.children[c]) {
                cur = cur.children[c];
                cur.refs--;
            }
        }
    }
}
class Solution {
    ROWS: number;
    COLS: number;
    constructor() {
        this.ROWS = 0;
        this.COLS = 0;
    }

    /**
     * @param {character[][]} board
     * @param {string[]} words
     * @return {string[]}
     */
    findWords(board, words) {
        const res = new Map();
        const visit = new Set();
        const root = new TrieNode();
    
        for (const w of words) {
            root.addWord(w);
        }
    
        this.ROWS = board.length;
        this.COLS = board[0].length;
    
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                this.dfs(r, c, root, '', board, res, visit, root, []);
            }
        }
    
        return Array.from(res.entries());
    }
    
    /**
     * @param {number} r
     * @param {number} c
     * @param {TrieNode} node
     * @param {string} word
     * @param {character[][]} board
     * @param {Map<string, Array<[number, number]>>} res
     * @param {Set<string>} visit
     * @param {TrieNode} root
     * @param {Array<[number, number]>} positions
     */
    dfs(r, c, node, word, board, res, visit, root, positions) {
        if (
            r < 0 ||
            r >= this.ROWS ||
            c < 0 ||
            c >= this.COLS ||
            !node.children[board[r][c]] ||
            node.children[board[r][c]].refs < 1 ||
            visit.has(r + ',' + c)
        ) {
            return;
        }
    
        visit.add(r + ',' + c);
        node = node.children[board[r][c]];
        word += board[r][c];
        positions.push([r, c]);
    
        if (node.isWord) {
            node.isWord = false;
            res.set(word, [...positions]);
            root.removeWord(word);
        }
    
        this.dfs(r + 1, c, node, word, board, res, visit, root, positions);
        this.dfs(r - 1, c, node, word, board, res, visit, root, positions);
        this.dfs(r, c + 1, node, word, board, res, visit, root, positions);
        this.dfs(r, c - 1, node, word, board, res, visit, root, positions);
    
        visit.delete(r + ',' + c);
        positions.pop();
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
    lightningIDX = []
    clickedIndexes = []
    redIDX = [[-1,-1]]
    orangeIDX = [[-1,-1]]
    letterLength = 5
    threeLetterWordsIndexes= [[-1,-1]]
    fourLetterWordsIndexes = [[-1,-1]]
    fiveLetterWordsIndexes = [[-1,-1]]
    lightingWord = '';
    sol = new Solution();
    score = 0;
    yellow2IDX = [[-1,-1]];
    wordsGrid: string[][] = [
        ["","","","","t", "r", "i", "a", "d","","","",""],
        ["","","","","p", "l", "e", "b", "e","","","",""],
        ["","","","","f", "o", "x", "e", "s","","","",""],
        ["","","","","a", "u", "g", "h", "t","","","",""],
        ["","","","","t", "a", "s", "t", "e","","","",""]
      ];
      allWords = words;
    lightningEnabled = true;
    lightningOn = false;


    
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



    isSafe(row: number, col: number, visited: boolean[][]): boolean {
        return (row >= 0 && row < this.wordsGrid.length && col >= 0 && col < this.wordsGrid[0].length && !visited[row][col]);
    }

    searchWord(row: number, col: number, visited: boolean[][], str: string, indexes: number[][]) {
        let x = [-1, -1, -1, 0, 0, 1, 1, 1];
        let y = [-1, 0, 1, -1, 1, -1, 0, 1];
        visited[row][col] = true;
        str = str + this.wordsGrid[row][col];
        indexes.push([row, col]);

        if (this.trie.search(str)) {
            console.log(str);
        }

        if (this.trie.startsWith(str)) {
            for (let dir = 0; dir < 8; dir++) {
                let newRow = row + x[dir];
                let newCol = col + y[dir];
                if (this.isSafe(newRow, newCol, visited)) {
                    this.searchWord(newRow, newCol, visited, str, indexes);
                }
            }
        }

        str = str.slice(0, -1);
        indexes.pop();
        visited[row][col] = false;
    }

    lookWords() {
        let visited = Array(this.wordsGrid.length).fill(false).map(() => Array(this.wordsGrid[0].length).fill(false));
        let str = '';
        let indexes: number[][] = [];
        for (let row = 0; row < this.wordsGrid.length; row++) {
            for (let col = 0; col < this.wordsGrid[0].length; col++) {
                this.searchWord(row, col, visited, str, indexes);
            }
        }
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
        let aboveRow;
        if(direction == 'up'){
            let row = this.selected; 
            for (let col = 0; col < this.wordsGrid[0].length; col++) {        
            if (row != 0){
                if (this.wordsGrid[row - 1][col] === '' && this.wordsGrid[row][col] !== '') {
                    this.wordsGrid[row - 1][col] = this.wordsGrid[row][col];
                    this.wordsGrid[row][col] = '';
                  }
            }
        }
             
                if(this.selected == 0){
                     
                    this.selected = 4;
                }
                else{
                    this.selected--;
                }

        }
        if(direction == 'down'){
           
            for (let col = 0; col < this.wordsGrid[0].length; col++) {
                //for (let row = this.selected; row < this.wordsGrid.length - 1; row++) {
                    let row = this.selected; 
                    
                    if (row != 4){
                        if (this.wordsGrid[row + 1][col] === '' && this.wordsGrid[row][col] !== '') {
                            this.wordsGrid[row + 1][col] = this.wordsGrid[row][col];
                            this.wordsGrid[row][col] = '';
                          }
                    }
                   
                
                //}
              }
            if (this.selected == 4){
                this.selected = 0
            }
            else{
                this.selected++;
            
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
    tryAddLightning(index: number[]) {
        // Check if lightning is enabled
        if (!this.lightningEnabled) {
            console.log('lightning is not enabled');
            return;
        }
    
        if (!Array.isArray(this.lightningIDX)) {
            console.error('lightningIDX is not an array');
            return;
        }
        
        const letter = this.wordsGrid[index[0]][index[1]];
        
        // Find the index in the lightningIDX array
        const existingIndex = this.lightningIDX.findIndex(
            (idx) => idx[0] === index[0] && idx[1] === index[1]
        );
        
        if (existingIndex !== -1) {
            // If the index exists, check if it is the first or last index
            if (existingIndex === 0 || existingIndex === this.lightningIDX.length - 1) {
                // Remove the index if it is the first or last
                this.lightningIDX.splice(existingIndex, 1);
                this.clickedIndexes.splice(existingIndex, 1);
                
                console.log('Removed index:', index);
        
                // Remove the letter from this.lightingWord
                const letterIndex = this.lightingWord.indexOf(letter);
                if (letterIndex !== -1) {
                    this.lightingWord = this.lightingWord.slice(0, letterIndex) + this.lightingWord.slice(letterIndex + 1);
                }
            } else {
                console.log('Only the first or last index can be removed:', index);
            }
        } else {
            // Check if the new index is within one move of the last index added
            const lastIndex = this.lightningIDX[this.lightningIDX.length - 1];
            if (
                !lastIndex ||
                (Math.abs(lastIndex[0] - index[0]) <= 1 && Math.abs(lastIndex[1] - index[1]) <= 1)
            ) {
                // If the index does not exist and is within one move, add it
                this.lightningIDX.push(index);
                this.clickedIndexes.push(index);
                console.log('Added index:', index);
        
                // Add the letter to this.lightingWord
                this.lightingWord += letter;
            }
            else {
                console.log('Index is not within one move of the last index added:', index);
            }
        }
        
        // Log the updated lightningIDX array
        console.log(this.wordsGrid[index[0]][index[1]]);
        console.log(this.lightningIDX);
        console.log('Updated lightingWord:', this.lightingWord)
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
        if(e.key == 'Enter'){
            console.log('enter the fragon')
            let splitGrid = this.wordsGrid.map(row => row.slice(4, 9));
            splitGrid = this.wordsGrid
            let wordsWithPositions = this.sol.findWords(splitGrid, this.allWords)
            .filter(([word, positions]) => !this.words.includes(word));
            console.log(wordsWithPositions)
            
        }

        if (e.key === 'Backspace'){
           return this.findSolution();
        }
        
   
       
        

    }
    calculateWordScore(word: string): number {

        const letterScores = {
            'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
            'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
            'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1,
            'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1,
            'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4,
            'Z': 10
        };
        let score = 0;
        for (let letter of word.toUpperCase()) {
            score += letterScores[letter] || 0; // Add the score of the letter, default to 0 if not found
        }
        return score;
    }
    trySubmitLightning(){
        if (!this.words.includes(this.lightingWord) && this.allWords.includes(this.lightingWord)){
            console.log('we have a winner')
            const score = this.calculateWordScore(this.lightingWord);
            this.score+=score;
            this.lightingWord = '';
            for (let [row, col] of this.lightningIDX){
                this.wordsGrid[row][col] = '';
            }
            this.lightningIDX = [];
        }
        
    }
    trySubmitLightning3(){
        if (this.allWords.includes(this.lightingWord)){
            console.log('we have a winner')
            const score = this.calculateWordScore(this.lightingWord);
            this.score+=score;
            this.lightingWord = '';
            for (let [row, col] of this.lightningIDX){
                this.wordsGrid[row][col] = '';
            }
            this.lightningIDX = [];
        }
        else{
            let yellow2 = [];
            let wordsWithPositions = this.sol.findWords(this.wordsGrid, this.allWords)
            .filter(([word, positions]) => !this.words.includes(word));
            for (const [word, positions] of wordsWithPositions) {
                console.log(`Word: ${word}`);
                console.log('Positions:');
                for (const [row, col] of positions) {
                    if (this.lightningIDX.some(([lightningRow, lightningCol]) => lightningRow === row && lightningCol === col)) {
                        yellow2.push([row, col]);
                    }
                }
            }
            this.lightningIDX = [];
            this.yellow2IDX = yellow2;

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
            else if (matchedIndexes.length ===3){
                console.log(`We have a yellow match ${matchedIndexes}`)
                const prevYellow = this.yellowIDX;
                this.yellowIDX = Array.from(new Set(matchedIndexes.concat(prevYellow)));
            }
            else if (matchedIndexes.length ===4){
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
    this.lightningEnabled = true;
    this.words = wordsCopy;
    this.letterLength--;
    this.checkForYellow();
    this.findSolution();
    
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