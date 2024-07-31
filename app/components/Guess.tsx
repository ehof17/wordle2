export default function Guess({isGuessed, guess, word}) {
    return (
        <div className={`grid grid-cols-5 gap-2 mb-2 ${isGuessed ? 'guessed-row' : 'not-guessed-row'}`}>
            {new Array(5).fill(0).map((_, i) => {
                const guessValue = (guess && guess[i]) || "";
                const empty = guessValue === "";
            
               
                let animationClass = "guess-anim-black";
    
                if (isGuessed) {
                    if (guess[i] === word[i]) {
                     
                        animationClass = "guess-anim-green";
                    } else if (word.includes(guess[i])) {
                      
                        animationClass = "guess-anim-yellow";
                    }
                }
    
                const animationDelay = `${i * 0.2}s`;
    
                return (
                    <div
                        key={i}
                        className={`h-16 w-16 border border-gray-400 text-white font-bold uppercase flex items-center justify-center transition ${empty ? 'not-guessed' : 'guessed'} ${isGuessed ? animationClass : 'guessed'}`}
                        style={{ animationDelay }}
                    >
                        {guessValue}
                    </div>
                );
            })}
        </div>
    );
}