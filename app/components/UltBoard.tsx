
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import MouseFollower from './MouseFollow';
import UltStore from '../stores/UltStore';
import EndScreen from './EndScreen';
import { useEffect, useRef, useState } from 'react';
import { fetchScores } from '../lib/firebase';
import MiniGrid from './MiniGrid';
import MiniGridContainer from './MiniGridContainer';
import { useSwipeable } from 'react-swipeable';
interface UltimateBoardProps {
  store: UltStore; 
}

const UltimateBoard = observer(({ store }: UltimateBoardProps) => {
  const elementRefs = useRef([]);
    const icons = [];
    for (let i = 0; i < store.sol.skip; i++) {
        icons.push(
            <FontAwesomeIcon 
                key={i} 
                icon={faBolt} 
                className="text-yellow-400" 
                onClick={action(() => { store.trySubmitLightning3() })} 
            />
        );
    }
    const [scores, setScores] = useState([]);
    const [showingColorIdx, setShowingColorIdx] = useState([]);
    const [weird, setWeird] = useState(false);
    const handleMouseOver = () => {
        document.documentElement.style.setProperty('--circle-size', '50px');
      };
      const handleWeirdButton = () => {
        // TODO: Check the columns with this button,
        // Maybe save the board state and have the boxes saved below in a form of their guesses
        store.saveBoardState()
        setWeird(true);
    
        setTimeout(() => {
            setWeird(false);
        }, 10000);
    }
    const handleSwipe = (index, direction) => {
      store.selected = index;
      console.log(index)
      switch (direction) {
        case 'LEFT':
          store.handleKeyUp({ key: 'a' });
          break;
        case 'RIGHT':
          store.handleKeyUp({ key: 'd' });
          break;
        case 'UP':
          store.handleKeyUp({ key: 'w' });
          break;
        case 'DOWN':
          store.handleKeyUp({ key: 's' });
          break;
        default:
          break;
      }
    };
    
      const handleMouseOut = () => {
        document.documentElement.style.setProperty('--circle-size', '15px');
      };

      useEffect(() => {
        const fetchAndSetScores = async () => {
          const fetchedScores = await fetchScores();
          const sortedScores = fetchedScores.sort((a, b) => b.score - a.score);
          setScores(sortedScores);
        };
      
        fetchAndSetScores();
      }, []);
  
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
          <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">
           
            <div className="flex">
                {icons}
            </div>
          </h1>
        
          {store.lightningEnabled && (
            <>
            <FontAwesomeIcon icon={faBolt} className="text-yellow-400" onClick={action(() => {store.trySubmitLightning3()})}/>
            <div className="mouse-follower-container">
              <MouseFollower />
            </div>
            </>
          )}
          <h3>Score: {store.score}</h3>
          
          {store.wordsGrid2.map((row, rowIndex) => {
            const swipeHandlers = useSwipeable({
              onSwipedLeft: () => handleSwipe(rowIndex, 'LEFT'),
              onSwipedRight: () => handleSwipe(rowIndex, 'RIGHT'),
              onSwipedUp: () => handleSwipe(rowIndex, 'UP'),
              onSwipedDown: () => handleSwipe(rowIndex, 'DOWN'),
           
            });
            const rowMovement = ((store.startingIndexes[rowIndex] -4));
            const movement = `translateX(${rowMovement*32}px)`;
            let started = [false, false, false, false, false];
            let NumstoReset = []
            return (
              <>
              <div key={`wordsGrid-${rowIndex}`} className="bg-green" {...swipeHandlers}>
                <div className="grid guessed-row" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))", transform: movement, transition: 'transform .3s ease-in-out' }}>
                  {row.map((letter, colIndex) => {
                    let bgag = store.lightningIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex) 
                      ? "text-yellow-400" 
                      : "text-white";
                    const dhb = (letter === "" || !store.lightningEnabled ) ? "" : "lens-inverse";
                    const dcs = (letter === "" || !store.lightningEnabled) ? "15px" : "50px";
                    const borderColor = letter === "" ? "" : "border-2";
                    const animationDelay = `${rowIndex * 0.2}s`;
                    let animationClass = "a";

                    // if (store.previousIDXs.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex +rowMovement )) {
                    //   animationClass = "guess-anim-reset";
                    
                    // }
                    
                    if (store.showColors || store.cheatToggled) {
                      if (store.red2IDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex +rowMovement )) {
                        animationClass = "guess-anim-red";
                    
                      }
                      if (store.orangeIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex +rowMovement)) {
                        animationClass = "guess-anim-orange";
                     
                      }
                      if (store.yellowIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex+rowMovement) ) {
                        animationClass = "guess-anim-yellow";
                     
                      }
                    }
                    if (elementRefs.current[rowIndex * 10 + colIndex] && store.previousIDXs.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex + rowMovement)) {
                      const element = elementRefs.current[rowIndex * 10 + colIndex];
                      let removedColor = null;
                      if (element) {
                        const classesToRemove = ["guess-anim-reset", "guess-anim-red", "guess-anim-orange", "guess-anim-yellow", "guess-anim-reset-red", "guess-anim-reset-orange", "guess-anim-reset-yellow"];
                        const colors = ["red", "orange", "yellow"];
                        classesToRemove.forEach(cls => {
                          if (element.classList.contains(cls)) {
                            console.log(`Removing class ${cls}`);
                            element.classList.remove(cls);
                            colors.forEach(color => {
                              if (cls.includes(color) ) {
                                removedColor = color;
                                animationClass = (`guess-anim-reset-${removedColor}`);
                                console.log(`${colIndex} ${rowIndex} ${removedColor}`)
                                
                              }
                            });
                          
                          }
                        });
                        void element.offsetWidth; // Force reflow
                        
                        
                      }
                    }
                  

                    
                    
                    const backgroundColor = letter === ""
                      ? "bg-transparent"
                      : rowIndex == store.selected
                      ? "bg-blue-400"
                      : "bg-transparent";
    
                    if (letter !== "") {
                      if (started[colIndex]) {
                        started[colIndex] = false;
                      } else {
                        started[colIndex] = true;
                      }
                    }
    
                    return (
                      <div
                        key={`wordsGrid-${rowIndex}-${colIndex}`}
                        
                        data-hover-behavior={dhb}
                        data-circle-size={dcs}
                        className={`h-8 w-8 ${borderColor} ${animationClass} ${backgroundColor} ${bgag} font-bold uppercase flex items-center justify-center`}
                        onMouseEnter={()=>handleMouseOver()}
                        onMouseLeave={handleMouseOut}
                        onClick={action(() => {store.tryAddLightning([rowIndex, colIndex])})}
                        style={{ animationDelay }}
                        ref={(el) => { elementRefs.current[rowIndex * 10 + colIndex] = el; }}
                      >
                        {letter}
                      </div>
                    );
                  })
                  }
                </div>
            
              </div>
             {store.previousIDXs}
             </>
            );
            })}
      <button className="bg-blue-400" onClick={action(e => { store.submitCol() })}>
        Submit
      </button>
      <button className="bg-blue-400" onClick={action(e => { store.resetPrevIndexes() })}>
        Reset Idxes
      </button>
      <div></div>
      <MiniGridContainer guesses={store.boardGuesses} />
      
      {store.done && <EndScreen store={store} scoresList={scores} />}
      </div>
);
});

export default UltimateBoard;