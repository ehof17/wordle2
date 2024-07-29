import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBolt} from '@fortawesome/free-solid-svg-icons';
import MouseFollower from './MouseFollow';

const UltimateBoard = observer(({ store }) => {
    const handleMouseOver = () => {
        document.documentElement.style.setProperty('--circle-size', '50px');
      };
    
      const handleMouseOut = () => {
        document.documentElement.style.setProperty('--circle-size', '15px');
      };
  
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
      <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">
        Ultimate Wordle {store.solution}
        {store.lightningIDX}
        
      </h1>
      {store.lightningEnabled && (
        <>
        <FontAwesomeIcon icon={faBolt} className="text-yellow-400" onClick={action(() => {store.trySubmitLightning3()})}/>
  <div className="mouse-follower-container">
    <MouseFollower />
  </div>
  </>
)}
      <p>{store.solutions && store.solutions.join(', ')}
    
      </p>
      <h3>Score: {store.score}</h3>
      {store.wordsGrid.map((row, rowIndex) => {
        
    let started = [false, false, false, false, false];
    return (
        <div key={`wordsGrid-${rowIndex}`} className="bg-green">
         
        <div className="grid" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
        
            {
            
            row.map((letter, colIndex) => {
                let bgag = store.lightningIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex) 
                ? "text-yellow-400" 
                : "text-white";
            const dhb = letter === "" ? "" : "lens-inverse";
            const dcs = letter === "" ? "15px" : "50px";
            const borderColor =
            letter === ""
            ?"bg-transparent"
            : rowIndex == store.selected
            ? "bg-blue-400"
            : "bg-transparent";

          
            
            
            const backgroundColor = 
            letter === ""
            ?"bg-transparent"
            : store.yellow2IDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex)
            ? "bg-yellow-400"
            : rowIndex == store.selected
            ? "bg-blue-400"
            : "bg-transparent";

            if (letter !== "") {
                if (started[colIndex]) {
                started[colIndex] = false;
                }
                else{
                started[colIndex] = true;}

            }

            return (
                <div
                key={`wordsGrid-${rowIndex}-${colIndex}`}
                data-hover-behavior={dhb}
                data-circle-size={dcs}
                className={`h-8 w-8 border-2 ${borderColor} ${backgroundColor} ${bgag} font-bold uppercase flex items-center justify-center`}
                onMouseEnter={handleMouseOver}
                onMouseLeave={handleMouseOut}
                onClick={action(() => {store.tryAddLightning([rowIndex, colIndex])})}
                >
                {letter}
                </div>
            );
            })}
        </div>
        </div>
    );
    })}
      {store.words.map((row, rowIndex) => {
        const preLength = store.startingIndexes[rowIndex];
        let selected = store.selected === rowIndex;
        const postLength = 13 - (preLength + store.letterLength);
        return (
            <>
          
          <div key={`words-${rowIndex}`} onClick={action(e => { store.swap(rowIndex) })}>
            <div className="grid" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
              {new Array(preLength).fill(0).map((_, i) => {
                const bgColor = "bg-transparent";
                return (
                  <div key={`pre-${rowIndex}-${i}`} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                  </div>
                );
              })}
              {new Array(store.letterLength).fill(0).map((_, i) => {
                const guessValue = (row && row[i]) || "";
                let bgColor = selected ? "bg-blue-400" : "bg-green-400";
                if (store.yellowIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === i)) {
                  bgColor = "bg-yellow-400";
                }
                if (store.orangeIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === i)) {
                  bgColor = "bg-orange-400";
                }
                if (store.redIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === i)) {
                  bgColor = "bg-red-400";
                }
                return (
                  <div key={`letter-${rowIndex}-${i}`} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                    {guessValue}
                  </div>
                );
              })}
              {new Array(postLength).fill(0).map((_, i) => {
                const bgColor = "bg-transparent";
                return (
                  <div key={`post-${rowIndex}-${i}`} className={`h-8 w-8 border border-gray-400 text-white font-bold uppercase flex items-center justify-center ${bgColor}`}>
                  
                  </div>
                );
              })}
            </div>
          </div>
          </>
        );

      })}
      <button className="bg-blue-400" onClick={action(e => { store.submitCol() })}>
        Submit
      </button>
    </div>
  );
});

export default UltimateBoard;