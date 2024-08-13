
import { act } from 'react';
import words from '../../words.json';
import { makeAutoObservable, action, toJS, set } from "mobx";
import { match } from 'assert';
import next from 'next';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface WordMatch {
    column: number;
    matchedRows: number[];
    unmatchedRows: number[];
    word: string;
}
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

    addWord2(word) {
        let node = this;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isWord = true;
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

    removeWord2(word) {
        let node = this;
        for (const char of word) {
            if (!node.children[char]) {
                return;
            }
            node = node.children[char];
        }
        node.isWord = false;
    }
}
class Solution {
    ROWS: number;
    COLS: number;
    skip: number;
    constructor() {
        this.ROWS = 0;
        this.COLS = 0;
        this.skip = 0;
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
                this.dfs(r, c, root, '', board, res, visit, root, [], words);
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
     * @param {Array<string>} targetWords
     */
    dfs(r, c, node, word, board, res, visit, root, positions, targetWords) {
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
    
    
    
        this.dfs(r + 1, c, node, word, board, res, visit, root, positions, targetWords);
        this.dfs(r - 1, c, node, word, board, res, visit, root, positions, targetWords);
        this.dfs(r, c + 1, node, word, board, res, visit, root, positions, targetWords);
        this.dfs(r, c - 1, node, word, board, res, visit, root, positions, targetWords);

        if (this.skip >= 2){
            this.dfs(r + 2, c, node, word, board, res, visit, root, positions, targetWords);
            this.dfs(r - 2, c, node, word, board, res, visit, root, positions, targetWords);
            this.dfs(r, c + 2, node, word, board, res, visit, root, positions, targetWords);
            this.dfs(r, c - 2, node, word, board, res, visit, root, positions, targetWords);
        }
    
        visit.delete(r + ',' + c);
        positions.pop();
    }
    isBoardSolvable(board, words) {
        const root = new TrieNode();
    
        // Add all words to the Trie
        for (const w of words) {
            root.addWord2(w);
        }
    
        this.ROWS = board.length;
        this.COLS = board[0].length;
    
        // Check each column
        for (let c = 0; c < this.COLS; c++) {
            if (this.checkColumnForSolvable(c, root, board)) {
                return true;
            }
        }
    
        // If no column is solvable, return false
        return false;
    }
    
    checkColumnForSolvable(c, root, board) {
        let word = '';
    
        // Construct the word from top to bottom in the column
        for (let r = 0; r < this.ROWS; r++) {
            if (!root.children[board[r][c]]) {
                return false;
            }
    
            word += board[r][c];
            console.log(word)
    
            // If the constructed word is a valid word, return true
            if (root.children[board[r][c]].isWord) {

                return true;
            }
        }
    
        // If the constructed word is not a valid word, return false
        return false;
    }
    findWordsByRows(board, words) {
        const res = new Map();
        const root = new TrieNode();
    
        for (const w of words) {
            root.addWord2(w);
        }
    
        this.ROWS = board.length;
        this.COLS = board[0].length;
        let wordsMap = new Map();
        for (let c = 0; c < this.COLS; c++) {
            wordsMap = this.checkColumn(c, root, board, res, words, wordsMap);
        }
        // Maybe if there are multiple in same columns we can transition between them
    
        // return Array.from(res.entries());
        return wordsMap;
    }
    

    checkColumn(c, root, board, res, targetWords, wordsMap) {
        let word = '';
        const positions = [];

        for (let r = 0; r < this.ROWS; r++) {
            if (!root.children[board[r][c]]) {
                word = '';
                positions.length = 0;
                continue;
            }

            word += board[r][c];
            positions.push([r, c]);

            // Check for partial matches

            const FiveLetterTargetWords = targetWords.filter(word => word.length === 5);
            for (const targetWord of FiveLetterTargetWords) {
                // Have a map of word and their column and matched rows

                if (this.isPartialMatch(word, targetWord, 3, board, c)) {
                    const swag = this.isPartialMatch(word, targetWord, 3, board, c)

                    if (wordsMap.has(targetWord)) {
                        wordsMap.get(targetWord).push(swag)
                    }
                    else
                    {
                    wordsMap.set(targetWord, [swag])
                    }
                }
            }

            if (root.children[board[r][c]].isWord) {
                res.set(word, [...positions]);
                root.removeWord2(word);
                word = '';
                positions.length = 0;
            }
        }
        return wordsMap;
    }

    isPartialMatch(word1, word2, minMatch, board, col) {
        let matchCount = 0;
        const len = Math.min(word1.length, word2.length);
        const missingLetters = {};
        const matchedRows = new Set<number>();
        const unmatchedRows = new Set<number>();
    
        // Track matched letters and their rows
        for (let i = 0; i < len; i++) {
            if (word1[i] === word2[i]) {
                matchCount++;
                matchedRows.add(i);
            } else {
                missingLetters[word2[i]] = i; // Track the row index where the letter should be
            }
        }
    
        if (matchCount >= minMatch) {
            // Check if missing letters are present in different rows
            for (const letter in missingLetters) {
                const rowIndex = missingLetters[letter];
                let found = false;
                for (let c = 0; c < board[rowIndex].length; c++) {
                    if (board[rowIndex][c] === letter && !matchedRows.has(rowIndex)) {
                        found = true;
                        unmatchedRows.add(rowIndex);
                        break;
                    }
                }
                if (!found) {
                    return false;
                }
            }
    
            // Ensure the total number of matched and unmatched rows is equal to the length of the word
            if ((Array.from(matchedRows)).length + (Array.from(unmatchedRows)).length === word2.length) {
                const wordMatch :WordMatch = {
                    column: col,
                    matchedRows: Array.from(matchedRows),
                    unmatchedRows: Array.from(unmatchedRows),
                    word: word2

                }
                return wordMatch;
            }
        }
        return false;
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
    showColors = false;
    lightingWord = '';
    possibleWord = '';
    cheatToggled = false;
    sol = new Solution();
    score = 0;
    yellow2IDX = [[-1,-1]];
    red2IDX = [[-1,-1]];
    wordsGrid: string[][] = [
        ["","","","","w", "h", "i", "s", "h","","","",""],
        ["","","","","f", "e", "u", "d", "s","","","",""],
        ["","","","","m", "o", "i", "i", "f","","","",""],
        ["","","","","f", "l", "a", "k", "y","","","",""],
        ["","","","","m", "o", "g", "u", "l","","","",""]
      ];
      wordsGrid2: string[][] = [
        ["","","","","w", "h", "i", "s", "h","","","",""],
        ["","","","","f", "e", "u", "d", "s","","","",""],
        ["","","","","m", "o", "i", "i", "f","","","",""],
        ["","","","","f", "l", "a", "k", "y","","","",""],
        ["","","","","m", "o", "g", "u", "l","","","",""]
      ];
      allWords = words;
    lightningEnabled = true;
    lightningOn = false;
    boardGuesses = [];
    keySequence = [];
    konamiCode = ['w', 'w', 's', 's', 'a', 'd', 'a', 'd']


    
   constructor() {
        makeAutoObservable(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    
    }


    get won(){
        return this.guesses[this.currentGuess-1] === this.word;
    }

    get done(){
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
    ValidateSolvable(){
        let wordsWithPositions = this.sol.findWords(this.wordsGrid, this.allWords)
        .filter(([word, positions]) => !this.words.includes(word));
        console.log(wordsWithPositions)
        const wordsEachLetterInDifferentRow = wordsWithPositions.filter(([word, positions]) => {
            const rows = positions.map(([row, col]) => row);
            return new Set(rows).size === 5;
        });
        console.log(wordsEachLetterInDifferentRow)
        console.log("Does this")
    }
    setShowColors(value){
        this.showColors = value;
    }


    async submitScore(name: string) {
        try {
          await addDoc(collection(db, 'scores'), {
            name: name,
            score: this.score,
            date: Timestamp.now()
          });
          console.log('Score submitted successfully');
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      }


    isSafe(row: number, col: number, visited: boolean[][]): boolean {
        return (row >= 0 && row < this.wordsGrid.length && col >= 0 && col < this.wordsGrid[0].length && !visited[row][col]);
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
            if (row != 0) {
                let wordStarted = false;
                let wordStartIndex = 0;
    
                for (let col = 0; col <= this.wordsGrid[0].length; col++) {
                    // Check for the end of a word or end of the row
                    if (col == this.wordsGrid[0].length || this.wordsGrid[row][col] === '') {
                        if (wordStarted) {
                            // Check if the entire word can move up
                            let canMoveUp = true;
                            for (let checkCol = wordStartIndex; checkCol < col; checkCol++) {
                                if (this.wordsGrid[row - 1][checkCol] !== '') {
                                    canMoveUp = false;
                                    break;
                                }
                            }
    
                            // Move the word up if possible
                            if (canMoveUp) {
                                for (let moveCol = wordStartIndex; moveCol < col; moveCol++) {
                                    this.wordsGrid[row - 1][moveCol] = this.wordsGrid[row][moveCol];
                                    if (this.yellow2IDX.some(([yellowRow, yellowCol]) => yellowRow === row && yellowCol === moveCol)) {
                                        this.yellow2IDX.push([row -1, moveCol]);
                                        this.yellow2IDX = this.yellow2IDX.filter(([yellowRow, yellowCol]) => yellowRow !== row || yellowCol !== moveCol);
                                    }
                                    
                                    this.wordsGrid[row][moveCol] = '';
                                }
                            }
    
                            wordStarted = false;
                        }
                    } else {
                        if (!wordStarted) {
                            wordStarted = true;
                            wordStartIndex = col;
                        }
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
           
            let row = this.selected;
        if (row != this.wordsGrid.length - 1) {
            let wordStarted = false;
            let wordStartIndex = 0;

            for (let col = 0; col <= this.wordsGrid[0].length; col++) {
                // Check for the end of a word or end of the row
                if (col == this.wordsGrid[0].length || this.wordsGrid[row][col] === '') {
                    if (wordStarted) {
                        // Check if the entire word can move down
                        let canMoveDown = true;
                        for (let checkCol = wordStartIndex; checkCol < col; checkCol++) {
                            if (this.wordsGrid[row + 1][checkCol] !== '') {
                                canMoveDown = false;
                                break;
                            }
                        }

                        // Move the word down if possible
                        if (canMoveDown) {
                            for (let moveCol = wordStartIndex; moveCol < col; moveCol++) {
                                this.wordsGrid[row + 1][moveCol] = this.wordsGrid[row][moveCol];
                                if (this.yellow2IDX.some(([yellowRow, yellowCol]) => yellowRow === row && yellowCol === moveCol)) {
                                    this.yellow2IDX.push([row + 1, moveCol]);
                                    this.yellow2IDX = this.yellow2IDX.filter(([yellowRow, yellowCol]) => yellowRow !== row || yellowCol !== moveCol);
                                }

                                this.wordsGrid[row][moveCol] = '';
                            }
                        }

                        wordStarted = false;
                    }
                } else {
                    if (!wordStarted) {
                        wordStarted = true;
                        wordStartIndex = col;
                    }
                }
            }
        }

            if (this.selected == 4){
                this.selected = 0
            }
            else{
                this.selected++;
            
            }
        }
        this.updateNewYellow();
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
            const newLightningIDX = [];
            
    
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
        this.updateNewYellow()
    }
    submitGuess(){
        if (words.includes(this.guesses[this.currentGuess])){
            this.currentGuess++;
        }
       
    }
    tryAddLightning(index: number[]) {
        // Check if lightning is enabled
        if (!this.lightningEnabled || this.sol.skip === 0) {
            console.log('lightning is not enabled');
            console.log(this.sol.skip)
            console.log(this.lightningEnabled)
            this.selected = index[0];
            return;
        }
    
        if (!Array.isArray(this.lightningIDX)) {
            console.error('lightningIDX is not an array');
            return;
        }
        
        const letter = this.wordsGrid[index[0]][index[1]];
        if (letter == ""){
        return;
        }
        
        // TODO: Fix the lightning indxes moving when the word is moved

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
            // Check if the new index is within the number of moves specified by this.sol.skip
            const lastIndex = this.lightningIDX[this.lightningIDX.length - 1];
            if (
                !lastIndex ||
                (Math.abs(lastIndex[0] - index[0]) <= this.sol.skip && Math.abs(lastIndex[1] - index[1]) <= this.sol.skip)
            ) {
                // If the index does not exist and is within the allowed number of moves, add it
                this.lightningIDX.push(index);
                this.clickedIndexes.push(index);
        
                // Add the letter to this.lightingWord
                this.lightingWord += letter;
            } else {
               
            }
        }
        
        // Log the updated lightningIDX array
      
    }
    saveBoardState(){
        const boardState = this.wordsGrid.map((row, rowIndex) => 
            row.map((letter, colIndex) => {
                let color = 'default';

                
                if (this.yellowIDX.some(([r, c]) => r === rowIndex && c === colIndex)) {
                    color = 'yellow';
                } else if (this.orangeIDX.some(([r, c]) => r === rowIndex && c === colIndex)) {
                    console.log('aayyOrangeTho')
                    color = 'orange';
                } else if (this.red2IDX.some(([r, c]) => r === rowIndex && c === colIndex)) {
                    color = 'red';
                }
        
                return { letter, color };
            })
        );
        
        console.log(boardState);
        this.boardGuesses.push(boardState);
    }
    handleKeyUp(e){

        const key = e.key.toLowerCase();
        this.keySequence.push(key);
        if (this.keySequence.length > this.konamiCode.length) {
            this.keySequence.shift(); // Remove the oldest key press
          }
      
          if (this.keySequence.join('') === this.konamiCode.join('')) {
            this.showAnswer();
            this.keySequence = []; // Reset the sequence after the cheat code is entered
          }
        if (this.showColors){
            this.setShowColors(false);
        }
        if (e.key === 'a'){
            if (!this.lightningIDX.some(([r, c]) => r === this.selected)) {
            return this.moveSelection('left');
            }
        }
        if (e.key === 'd'){
            if (!this.lightningIDX.some(([r, c]) => r === this.selected)) {
            return this.moveSelection('right');
            }
            // else, add a move animation  where it cant' move
            // move one way then back to show it can't move
        }
        if (e.key === 's'){
            return this.changeSelected('down');
        }
        if (e.key === 'w'){
            return this.changeSelected('up');
        }
        if(e.key == 'Enter'){
            console.log(this.sol.isBoardSolvable(this.wordsGrid, this.allWords));
            console.log('enter the fragon')

            this.ValidateSolvable();
            // let splitGrid = this.wordsGrid.map(row => row.slice(4, 9));
            // splitGrid = this.wordsGrid
            // let wordsWithPositions = this.sol.findWords(splitGrid, this.allWords)
            // .filter(([word, positions]) => !this.words.includes(word));
            // console.log(wordsWithPositions)
            // const wordsEachLetterInDifferentRow = wordsWithPositions.filter(([word, positions]) => {
            //     const rows = positions.map(([row, col]) => row);
            //     return new Set(rows).size === 5;
            // });
            const wordsMap = this.sol.findWordsByRows(this.wordsGrid, this.allWords);
            const colToKeys = new Map<number, number[]>();
            
            for (const [key, value] of wordsMap) {
                for (const match of value) {
                    if(colToKeys.has(match.column)){
                        if (colToKeys.get(match.column).length < match.matchedRows.length){
                            colToKeys.set(match.column, match.matchedRows);
                     
                        }
                    }
                    else{
                        colToKeys.set(match.column, match.matchedRows);
                    }
                   
                }
            }
           
            let yellow = [];
            for (const [key, value] of colToKeys) {
                for (const row of value){
                    yellow.push([row, key]);
                }
            }
            console.log("Ay so we gone now")
            console.log(yellow)
            console.log(yellow.length)
            if (yellow.length ===0){
                console.log('Maybe Try re ordering the words?')
                const row1 = this.wordsGrid[0];
                const row2 = this.wordsGrid[1];
                const row3 = this.wordsGrid[2];
                const row4 = this.wordsGrid[3];
                const row5 = this.wordsGrid[4];
                const newGrid = [row5, row4, row3, row2, row1];
                this.wordsGrid = newGrid;
                this.wordsGrid2 = newGrid;
                console.log(this.wordsGrid)
                console.log(this.wordsGrid2)
            }
            
           
           
        }

        if (e.key === 'Backspace'){
           return this.findSolution();
        }
        if(e.key === 'l'){
            return this.MakeSolvable();
        }
        
   
       
        

    }
    MoveBoardDown(index) {
        // Create a deep copy of this.wordsGrid and rotate the rows
        let SWAGG = [...this.wordsGrid.slice(index), ...this.wordsGrid.slice(0, index)].map(row => [...row]);
        let SWAGG2 = [...this.wordsGrid.slice(index), ...this.wordsGrid.slice(0, index)].map(row => [...row]);
    
    
        // Create deep copies of SWAGG for this.wordsGrid and this.wordsGrid2
        this.wordsGrid = SWAGG.map(row => [...row]);
        this.wordsGrid2 = SWAGG2.map(row => [...row]);
    
    
    }

    showAnswer() {
        // Implement the logic to show the answer
        this.showColors = true;
        this.cheatToggled = true;
        // Add your answer display logic here
      }
    updateNewYellow(){
        const wordsMap = this.sol.findWordsByRows(this.wordsGrid, this.allWords);
        const colToKeys = new Map<number, number[]>();
        
        for (const [key, value] of wordsMap) {
            for (const match of value) {
                if(colToKeys.has(match.column)){
                    if (colToKeys.get(match.column).length < match.matchedRows.length){
                        colToKeys.set(match.column, match.matchedRows);
                 
                    }
                }
                else{
                    colToKeys.set(match.column, match.matchedRows);
                }
               
            }
        }
        let yellow = [];
        let orange = [];
        let red = [];
        
        for (const [key, value] of colToKeys) {
            if (value.length === 3) {
                for (const row of value) {
                    yellow.push([row, key]);
                }
            } else if (value.length === 4) {
                for (const row of value) {
                    orange.push([row, key]);
                }
            } else if (value.length === 5) {
                for (const row of value) {
                    red.push([row, key]);
                }
            }
        }
        this.yellow2IDX = yellow;

        this.orangeIDX = orange;
        this.red2IDX = red;
        this.yellowIDX = yellow;
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
      
        console.log("something has happened")
        for (let q = 0; q < 5; q++){
        // For each letter in every word, check the other words and see if a letter matches a word in the given words.
        const firstLetter =this.words[STARTINGWORD][q];

        const wordsStartingWithFirstLetter = words.filter(word => new RegExp(`^${firstLetter}`, 'i').test(word));
       
        for (let STARTINGWORD = 0; STARTINGWORD < 5; STARTINGWORD++){
        // If we have words that start here, we need to check every other letter in the other words
        for (let i = 0; i < 5; i++){
            const letterToCheck = this.words[(STARTINGWORD + 1) % 5][i];
            const wordsStartingWithFirstTwoLetters = wordsStartingWithFirstLetter.filter(word => new RegExp(`^${firstLetter}${letterToCheck}`, 'i').test(word));

            if (wordsStartingWithFirstTwoLetters.length > 0){
                for (let j = 0; j < 5; j++){
                    const letterToCheck2 = this.words[(STARTINGWORD + 2) % 5][j];
                    const wordsStartingWithFirstThreeLetters = wordsStartingWithFirstTwoLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}`, 'i').test(word));
                   

                    if (wordsStartingWithFirstThreeLetters.length > 0){
                        for (let k = 0; k < 5; k++){
                            const letterToCheck3 = this.words[(STARTINGWORD + 3) % 5][k];
                            const wordsStartingWithFirstFourLetters = wordsStartingWithFirstThreeLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}${letterToCheck3}`, 'i').test(word));
                          
                           
                            if (wordsStartingWithFirstFourLetters.length > 0){
                                for (let l = 0; l < 5; l++){
                                    const letterToCheck4 = this.words[(STARTINGWORD + 4) % 5][l];
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

}}
}
MakeSolvable(){
    this.solution = '?';
    this.solutions = [];
    const STARTINGLETTER = 0;
 
  
    console.log("something has happened")
    for (let STARTINGWORD = 0; STARTINGWORD < 5; STARTINGWORD++){
    for (let q = 0; q < 5; q++){
    // For each letter in every word, check the other words and see if a letter matches a word in the given words.
    const firstLetter =this.words[STARTINGWORD][q];

    const wordsStartingWithFirstLetter = words.filter(word => new RegExp(`^${firstLetter}`, 'i').test(word));
   
    for (let STARTINGWORD = 0; STARTINGWORD < 5; STARTINGWORD++){
    // If we have words that start here, we need to check every other letter in the other words
    for (let i = 0; i < 5; i++){
        const letterToCheck = this.words[(STARTINGWORD + 1) % 5][i];
        const wordsStartingWithFirstTwoLetters = wordsStartingWithFirstLetter.filter(word => new RegExp(`^${firstLetter}${letterToCheck}`, 'i').test(word));

        if (wordsStartingWithFirstTwoLetters.length > 0){
            for (let j = 0; j < 5; j++){
                const letterToCheck2 = this.words[(STARTINGWORD + 2) % 5][j];
                const wordsStartingWithFirstThreeLetters = wordsStartingWithFirstTwoLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}`, 'i').test(word));
               

                if (wordsStartingWithFirstThreeLetters.length > 0){
                    for (let k = 0; k < 5; k++){
                        const letterToCheck3 = this.words[(STARTINGWORD + 3) % 5][k];
                        const wordsStartingWithFirstFourLetters = wordsStartingWithFirstThreeLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}${letterToCheck3}`, 'i').test(word));
                      
                       
                        if (wordsStartingWithFirstFourLetters.length > 0){
                            for (let l = 0; l < 5; l++){
                                const letterToCheck4 = this.words[(STARTINGWORD + 4) % 5][l];
                                const wordsStartingWithFirstFiveLetters = wordsStartingWithFirstFourLetters.filter(word => new RegExp(`^${firstLetter}${letterToCheck}${letterToCheck2}${letterToCheck3}${letterToCheck4}`, 'i').test(word));
                                
                              
                                if (wordsStartingWithFirstFiveLetters.length > 0){
                                    this.solution = wordsStartingWithFirstFiveLetters[0];
                                    console.log(this.solution)
                                    console.log(STARTINGWORD)
                                    if (STARTINGWORD === 0){
                                        return;
                                    }
                                    else{
                                    this.MoveBoardDown(STARTINGWORD);
                                    return;
                                    }
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
}
console.log("Oh boy. We are in trouble")
// TODO Grab new Words or somethin
}
checkForYellow(){
    // const yellowIDX = [];
    // this.redIDX = [];
    // this.yellowIDX = [];
    // this.orangeIDX = [];
    // for (let i = 0; i < this.letterLength; i++){
    //     const letterToCheck = this.words[0][i];
    //     const trueIndex = i + this.startingIndexes[0];
    //     const solutionsThatStartWithIt = this.solutions.filter(word => new RegExp(`^${letterToCheck}`, 'i').test(word));
    //     const possibleNextLetters =solutionsThatStartWithIt.map(word => word[1])
    //     const swag = this.yellowHelper(possibleNextLetters, letterToCheck, trueIndex, this.startingIndexes[0], 1, [[0, i]]);
        
    // }
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
    
    // if (this.redIDX.length < this.letterLength){
    //     return;
    // }
    // const wordsCopy = this.words.map(innerArray => [...innerArray]);
    // const  redIDXCopy =[...this.redIDX];
    // console.log('help me')
    // for (let [row, col] of redIDXCopy){
    //     console.log(`Row ${row} and col ${col}`)
    //     const numsToMove = -(col-(this.letterLength-1))
    //     const preNumsToKeep = this.words[row].slice(0, this.letterLength - numsToMove-1);
    //     const numsToMoveBack = this.words[row].slice(this.letterLength - numsToMove);
    //     wordsCopy[row] = preNumsToKeep.concat(numsToMoveBack);
        
        
        
    // }
    this.setShowColors(true)
    this.showColors = true;
    this.trySubmitLightning3();
    if (this.red2IDX.length < this.letterLength){
        this.saveBoardState();
        this.currentGuess++;
        return;
    }
    const red2IDXCopy = [...this.red2IDX];
    const wordsGridCopy = this.wordsGrid.map(innerArray => [...innerArray]);
    for (const [row, col] of red2IDXCopy) {
        const letter = wordsGridCopy[row][col];
        const score = this.calculateWordScore(letter);
        this.score += score;

    
    }

    this.wordsGrid = wordsGridCopy;

    this.sol.skip++;
    this.lightningEnabled = true;
    //this.words = wordsCopy;
    this.saveBoardState();
    this.letterLength--;
    this.currentGuess++;
    
    //this.checkForYellow();
    //this.findSolution();
    
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