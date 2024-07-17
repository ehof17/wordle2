import {observer} from 'mobx-react-lite'
export default observer(function Querty({store}) {
    const querty = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]
    let i = 0;
    return (
        <div>
            {querty.map((row) => (
                <div className="flex justify-center">
                    {row.split('').map((letter) => {
                        const bgColor = store.exactGuesses.includes(letter)
                        ? 'bg-green-400'
                        : store.inexactGuesses.includes(letter)
                        ? 'bg-yellow-400'
                        : store.allGuesses.includes(letter)
                        ? 'bg-gray-400'
                        : 'bg-gray-200'
                    return (
                        <div key={i++} className={`m-px w-10 h-10 ${bgColor} rounded-md flex items-center justify-center uppercase`}>
                            {letter}
                        </div>
                    )
})}
                </div>
            ))}
        </div>
    )
})