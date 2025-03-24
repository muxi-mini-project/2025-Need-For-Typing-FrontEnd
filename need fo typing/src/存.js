import { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./carGamePage.css";

export default function Test() {
  const [isPaused, setIsPaused] = useState(false);
  const [targetText, setTargetText] = useState("啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊");
  const [userInput, setUserInput] = useState("");
  const [energy, setEnergy] = useState(0);
  const [backgroundOffset, setBackgroundOffset] = useState(0); 
  const [sceneIndex, setSceneIndex] = useState(0); 
  const [isBlocked, setIsBlocked] = useState(false); 
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false); 
  const [pausedOverlayVisible, setPausedOverlayVisible] = useState(false);
  const [carPosition, setCarPosition] = useState(0); 
  const [scrollOffset, setScrollOffset] = useState(0); 
  const [visibleCharCount,setVisibleCharCount] = useState(21)
  const [showCurtain, setShowCurtain] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const sceneLength = 3; 
  const totalScenes = 6; 

  const handleInputChange = (e) => {
    if (isGameOver || isPaused) return; 
    const value = e.target.value;
    const isBackspace = e.nativeEvent.inputType === "deleteContentBackward"; 
    const isPinyinInput = e.nativeEvent.inputType === 'insertCompositionText';
   
    if (isBackspace) {
      e.preventDefault();
      return;
    }
  
    if (isPinyinInput) {
      return;
    }

    const isCorrect = value[value.length - 1] === targetText[value.length - 1];
  
    if (isCorrect) {
      setIsBlocked(false); 
      setUserInput(value);

      const moveStep = 100 / targetText.length;
      setBackgroundOffset((prev) => Math.min(prev + moveStep, 100));
  
      
      const energyStep = 100 / targetText.length;
      setEnergy((prev) => Math.min(prev + energyStep, 100));
  
    
      setScore((prev) => prev + 10); 
     
      const completedScenes = Math.floor(value.length / (targetText.length / (totalScenes * sceneLength)));
      if (completedScenes !== sceneIndex) {
        setSceneIndex(completedScenes);
      }
    } else {
      if (!isBlocked) {
        setIsBlocked(true); 
      }
        setUserInput(value);
    }

    if (value.length >= targetText.length) {
      e.target.disabled = true;
      setIsGameOver(true); 
      setCarPosition(80); 
      setShowCurtain(true);
      setTimeout(() => {
        navigate("/CarSettlementPage");  
      }, 1000);  
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setPausedOverlayVisible(true); 
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      setIsPaused(true); 
    }
  };

  const resumeGame = () => {
    setPausedOverlayVisible(false); 
    setIsPaused(false); 
  };


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    
  }, [userInput, backgroundOffset]); 

  const getColoredText = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: "8px",
          transform: `translateX(-${scrollOffset}px)`,
          transition: "transform 0.3s ease-in-out", 
        }}
      >
        {targetText.split("").map((char, index) => {
          const isCorrect = char === userInput[index];
          return (
            <span
              key={index}
              style={{
                color: index < userInput.length ? (isCorrect ? "blue" : "red") : "black",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  
  useEffect(() => {
    if (sceneIndex % 2 === 1) {
      
      setEnergy(0);
    }
  }, [sceneIndex]);

  useEffect(() => {
    
    if (inputRef.current) {
      inputRef.current.scrollLeft = `${scrollOffset}px`;  
    }
  }, [scrollOffset]);  

  useEffect(() => {
    if (userInput.length > visibleCharCount) {
      setVisibleCharCount(prev => prev + 21);
      setScrollOffset(prev => prev + 600);
    } 
  }, [userInput]); 

  return (
    <>
      <style>
        {`
          @keyframes curtainMove {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0%);
            }
          }
        `}

      </style>

      <div className="game-container">

      {showCurtain && (
                  <div
                    style={{
                      position: "absolute",
                      width: "79rem",
                      height: "41rem",
                      backgroundColor: "#B3E3FF",
                      borderRadius: "15px",
                      transform: "translateX(-100%)",
                      animation: "curtainMove 1s linear forwards",
                      zIndex:'3'
                    }}/>
                )}
        
        <div className="score-display">Score: {score}</div>

        <div
          className="background"
          style={{
            transform: `translateX(-${backgroundOffset}%)`, 
            transition: isPaused ? "none" : "transform 0.3s linear", 
          }}
        >
          <img src="/海边公路1.png" alt="Background 1" />
          <img src="/海边公路2.png" alt="Background 2" />
          <img src="/海边公路3.png" alt="Background 3" />
          <img src='切背景.png' alt="隧道" />
          <img src="/村庄公路1.png" alt="Background 1" />
          <img src="/村庄公路2.png" alt="Background 2" />
          <img src="/村庄公路3.png" alt="Background 3" />
          <img src='切背景.png' alt="隧道" />
          <img src="/山地公路1.png" alt="Background 1" />
          <img src="/山地公路2.png" alt="Background 2" />
          <img src="/山地公路3.png" alt="Background 3" />
          <img src='切背景.png' alt="隧道" />
          <img src="/麦田公路1.png" alt="Background 1" />
          <img src="/麦田公路2.png" alt="Background 2" />
          <img src="/麦田公路3.png" alt="Background 3" />
          <img src='切背景.png' alt="隧道" />
          <img src="/森林公路1.png" alt="Background 1" />
          <img src="/森林公路2.png" alt="Background 2" />
          <img src="/森林公路3.png" alt="Background 3" />
          <img src='切背景.png' alt="隧道" />
        </div>

        <div
          className="car"
          style={{
            transform: `translateX(${carPosition}rem)`,
            transition: "transform 0.5s ease-out", 
          }}
        >
          <img src="/车.png" alt="Car" />
        </div>

        <div className="energy-bar">
          <div
            className="energy-fill"
            style={{
              width: `${energy}%`, 
            }}
          ></div>
        </div>

        <div className="typing-area">
          
        <div 
          className="text-display"
        >{getColoredText()}</div>

          <input
            style={{
              overflowX: 'auto', 
              whiteSpace: 'nowrap'  
            }}
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="typing-input"
            placeholder="Start typing..."
            disabled={isGameOver || userInput === targetText || isPaused} 
          />
      
        </div>

      
        {pausedOverlayVisible && (
          <div className="paused-overlay">
            <div className="paused-message">游戏已暂停</div>
            <div className="paused-buttons">
              <button onClick={resumeGame} className="paused-btn">继续游戏</button>
              <button onClick={() => navigate("/CarMainPage")} className="paused-btn">退出游戏</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
