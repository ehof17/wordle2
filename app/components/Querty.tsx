import {observer} from 'mobx-react-lite'
import PuzzleStore from '../stores/PuzzleStore';

interface QuertyProps {
  store: PuzzleStore; 
}
export default observer(function Querty({store}: QuertyProps) {
    const querty = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    return (
        <div>
            {querty.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center">
                    {row.split('').map((letter, letterIndex) => {
                        const bgColor = store.exactGuesses.includes(letter)
                        ? 'bg-green-400'
                        : store.inexactGuesses.includes(letter)
                        ? 'bg-yellow-400'
                        : store.allGuesses.includes(letter)
                        ? 'bg-gray-400'
                        : 'bg-gray-200';
                        return (
                            <div key={`${rowIndex}-${letterIndex}`} className={`m-px w-10 h-10 ${bgColor} rounded-md flex items-center justify-center uppercase`}>
                                {letter}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
});