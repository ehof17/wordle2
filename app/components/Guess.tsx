export default function Guess({isGuessed, guess, word}){
    console.log(`guess: ${guess}`)
    return <div className="grid grid-cols-5 gap-2 mb-2">

        {new Array(5).fill(0).map((_, i) => {
            const guessValue = (guess && guess[i]) || "";
            const empty = guessValue === "";
            
            
            const bgColor = !isGuessed 
            ? "bg-black"
            : guess[i] === word[i]
            ? "bg-green-400"
            : word.includes(guess[i])
            ? 'bg-yellow-400'
            : "bg-black"
            return(
            <div key = {i} className = {`h-16 w-16 border border-gray-400 text-white
            font-bold uppercase flex items-center justify-center
            ${bgColor} transition ${empty ? 'not-guessed' : 'guessed'} ${isGuessed? 'guess-anim' : 'guessed' }`}>
                {guessValue}
            </div>)
})}
    </div>
}