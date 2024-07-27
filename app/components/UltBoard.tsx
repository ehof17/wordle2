
import { observer } from "mobx-react-lite";
import Guess from "./Guess";
import { action } from "mobx";
import { tree } from "next/dist/build/templates/app-page";
/* Grid will be 13 x 5*/

const UltimateBoard = observer(({store}) => {
   
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
        <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">Ultimate Wordle {store.solution}</h1>
        <p>{store.solutions && store.solutions.join(', ')}</p>
        {store.wordsGrid.map((row,index) => {
            return (
                <div key={index} className="bg-green">
                    <div className="grid" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))"  }}>
                        {row.map((letter, i) => {
                            const bgColor = index === store.selected?"bg-green-400" : "bg-transparent";
                            return (
                                <div key={i} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                                    {letter}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        })}
        {store.words.map((row,index) => {
        const preLength = store.startingIndexes[index];
        let selected = store.selected == index
        const postLength = 13 - (preLength + store.letterLength);
        return (
            <div key={index} onClick={action(e => {store.swap(index)})}>
                <div className="grid" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
                    {new Array(preLength).fill(0).map((_, i) => {
                       
                        const bgColor = "bg-transparent";

                        return (
                            <div key={i} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                             
                            </div>
                        );
                    })}
                    
                    {new Array(store.letterLength).fill(0).map((_, i) => {
                        const guessValue = (row && row[i]) || "";
                        
                    
                        
                        let bgColor = selected ? "bg-blue-400" : "bg-green-400";

                        if (store.yellowIDX.some(([yRow, yCol]) => yRow === index && yCol === i)) {
                            bgColor = "bg-yellow-400";
                        }
                        if (store.orangeIDX.some(([yRow, yCol]) => yRow === index && yCol === i)) {
                            bgColor = "bg-orange-400";
                        }
                        if (store.redIDX.some(([yRow, yCol]) => yRow === index && yCol === i)) {
                            bgColor = "bg-red-400";
                        }
                        return (
                            <div key={i} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                                {guessValue}
                            </div>
                        );
                    })}
                    {new Array(postLength).fill(0).map((_, i) => {
                       
                       const bgColor = "bg-transparent";

                       return (
                           <div key={i} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                            
                           </div>
                       );
                   })}
                </div>
            </div>
        );
    })}
    <button className="bg-blue-400" onClick={action(e => {store.submitCol()})}>
        Submit
    </button>
        </div>
       
            
           
       
    );
  });
  export default UltimateBoard;