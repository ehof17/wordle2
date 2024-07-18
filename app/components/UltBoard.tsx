
import { observer } from "mobx-react-lite";
import Guess from "./Guess";
/* Grid will be 13 x 5*/
const UltimateBoard = observer(({store}) => {

    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
        <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">Ultimate Wordle</h1>
        {store.words.map((row, index) => {
        const preLength = store.startingIndexes[index];
        const postLength = 13 - (preLength + 5);
        return (
            <div key={index}>
                <div className="grid" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
                    {new Array(preLength).fill(0).map((_, i) => {
                       
                        const bgColor = "bg-black";

                        return (
                            <div key={i} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                             
                            </div>
                        );
                    })}
                    
                    {new Array(5).fill(0).map((_, i) => {
                        const guessValue = (row && row[i]) || "";
                        const bgColor = guessValue == "" ? "bg-black" : "bg-green-400";

                        return (
                            <div key={i} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                                {guessValue}
                            </div>
                        );
                    })}
                    {new Array(postLength).fill(0).map((_, i) => {
                       
                       const bgColor = "bg-black";

                       return (
                           <div key={i} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                            
                           </div>
                       );
                   })}
                </div>
            </div>
        );
    })}
        </div>
            
            
           
       
    );
  });
  export default UltimateBoard;