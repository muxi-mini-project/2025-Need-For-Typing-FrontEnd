import { useState, useEffect, useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import TimeOut from './timeOut';

export default function MusicGamePage() {
    const [notes, setNotes] = useState([]);
    const [score, setScore] = useState(0);
    const [energy, setEnergy] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [isEnergyLocked, setIsEnergyLocked] = useState(false);
    const [outerCircleEffect, setOuterCircleEffect] = useState(false);
    const [showTimeOut, setShowTimeOut] = useState(false);  
    const [cherryBlossoms, setCherryBlossoms] = useState([]);
    const [isFalling,setIsFalling] = useState(false);
    const [curtainOpened, setCurtainOpened] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const {difficulty,mode} = location.state

    const feedbackTimeoutRef = useRef(null);
    const gameIntervalRef = useRef(null);  
    const audioRef = useRef(null); 
    const decreaseEnergyRef = useRef(null);
    const bpm = 120;  
    const beatInterval = 60 / bpm; 

    const CIRCLE_CENTER = 20;
    const CIRCLE_RADIUS = 10;

    

    useEffect(() => {
        const audio = new Audio('https://files.freemusicarchive.org/storage-freemusicarchive-org/tribe-of-noise-pro/music/00046ed484682b33d3200651d856f2d0.mp3');
        audioRef.current = audio;
        console.log(mode);
        

        const handleAudioEnd = () => {
            setIsPlaying(false);
            clearInterval(gameIntervalRef.current);
            setCurtainOpened(true)
        };

        audio.addEventListener('ended', handleAudioEnd);

        return () => {
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, []);

    useEffect(() => {
        if (!isPlaying || !audioRef.current) return;

        const audio = audioRef.current;
        if (isPlaying) {
            audio.play();
        } else {
            audio.pause(); 
        }

        const generateNote = () => {
            const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            setNotes((prevNotes) => [
                ...prevNotes,
                { letter: randomLetter, x: 100, y: 50, status: 'active' },
            ]);
        };

        const startGeneratingNotes = () => {
            gameIntervalRef.current = setInterval(generateNote, Math.max(beatInterval * 1000, 500));
        };

        startGeneratingNotes();

        const moveInterval = setInterval(() => {
            const adjustedSpeed = difficulty + Math.sin(audio.currentTime / 5) * 0.1;
            setNotes((prevNotes) =>
                prevNotes
                    .map((note) => ({ ...note, x: Math.max(note.x - adjustedSpeed, 0.1) })) 
                    .filter((note) => note.x > 12)  
            );
        }, beatInterval / 20);

        return () => {
            clearInterval(gameIntervalRef.current);
            clearInterval(moveInterval);
            audio.pause();
        };
    }, [isPlaying]);

    useEffect(() => {
        if(energy === 100){
            setIsEnergyLocked(true);
            setIsFalling(true);
            decreaseEnergyRef.current = setInterval(() => {
                setEnergy((prev) => Math.max(0, prev - 10));
            },1000)
        }
        if(energy === 0){
            setIsEnergyLocked(false)
            setIsFalling(false)
            clearInterval(decreaseEnergyRef.current)
            decreaseEnergyRef.current = null
        }

        return () => {
            if (energy === 0) { 
                clearInterval(decreaseEnergyRef.current);
                decreaseEnergyRef.current = null;
            }
        };
    },[energy])


    useEffect(() => {
        
        const createCherryBlossoms = () => {
            const blossoms = Array.from({ length: 70 }, () => ({
                x: Math.random() * 100,
                y: -10,
                size: Math.random() * 10 + 5,
                speed: Math.random() * 1 + 0.2,
                rotation: Math.random() * 360,
            }));
            setCherryBlossoms(blossoms);
        };
    
        if (isFalling) {
            createCherryBlossoms(); 
        }
    
        const interval = setInterval(() => {
            setCherryBlossoms((prevBlossoms) =>
                prevBlossoms
                    .map((blossom) => ({ ...blossom, y: blossom.y + blossom.speed }))
                    .filter((blossom) => blossom.y < 90)
            );
        }, 50);
    
        return () => clearInterval(interval);
    }, [isFalling]); 
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsPlaying(!isPlaying);  
                setShowTimeOut(!showTimeOut); 
            }

            if (!isPlaying) return;

            const key = e.key.toUpperCase();
            const activeNotesInCircle = notes.filter(
                (note) => note.status === 'active' && Math.abs(note.x - CIRCLE_CENTER) <= CIRCLE_RADIUS
            );

            if (activeNotesInCircle.length === 0) return;

            setNotes((prevNotes) =>
                prevNotes.map((note) => {
                    if (note.status === 'active' && Math.abs(note.x - CIRCLE_CENTER) <= CIRCLE_RADIUS) {
                        if (note.letter === key) {
                            const distance = Math.abs(note.x - CIRCLE_CENTER);

                            if (distance <= 3) {
                                setScore((prev) => prev + 20);
                                setFeedback('great');
                                isEnergyLocked ? '' : setEnergy((prev) => Math.min(100, prev + 5));
                            } else {
                                setFeedback('false');
                                isEnergyLocked ? '' : setEnergy((prev) => Math.max(0, prev - 5));
                            }

                            setOuterCircleEffect(true);
                            setTimeout(() => setOuterCircleEffect(false), 200);
                        } else {
                            setFeedback('false');
                            setEnergy((prev) => Math.max(0, prev - 3));
                        }

                        return { ...note, status: 'removed' };
                    }
                    return note;
                }).filter((note) => note.status !== 'removed')
            );

            clearTimeout(feedbackTimeoutRef.current);
            feedbackTimeoutRef.current = setTimeout(() => setFeedback(''), 500);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, notes]);

    function ProgressBar  ({ audioRef })  {
        
        useEffect(() => {
            if (!audioRef.current) return;
    
            const audio = audioRef.current;
    
            let animationFrameId
            const updateProgress = () => {
                if (audio.currentTime && audio.duration) {
                    setProgress((audio.currentTime / audio.duration) * 100);
                }
                 animationFrameId = requestAnimationFrame(updateProgress);
            };
        
            updateProgress(); 
        
            return () => cancelAnimationFrame(animationFrameId);
        }, [progress]);
    
        return (
            <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
            </div>
        );
    };
    

    return (
        <>
            <style>
            {`
            @keyframes curtainOpen {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(0);
            }
            }

            @keyframes curtainOpenRight {
            0% {
                transform: translateX(100%);
            }
            100% {
                transform: translateX(0);
            }
            }

            .curtain {
            position: fixed;
            top: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(to bottom right, #ffe6f2, #ffccda); 
            border: 8px solid #ff99b5;
            box-shadow: 0 0 20px rgba(255, 128, 171, 0.5);
            z-index: 2;
            }

            .curtain-left {
            left: 0;
            transform: translateX(-100%);
            }

            .curtain-right {
            right: 0;
            transform: translateX(100%);
            }

            .curtain.opened-left {
            animation: curtainOpen 1.5s ease-out forwards;
            }

            .curtain.opened-right {
            animation: curtainOpenRight 1.5s ease-out forwards;
            }
        `}
        </style>

        <div style={styles.background}>
            <img src="" alt="暂时无法显示" style={styles.avatar} />
            <div style={styles.information}>
                <p style={{ ...styles.p, fontSize: '24px' }}>Cypher</p>
                <p style={{ ...styles.p, fontSize: '18px' }}>id:114514</p>
            </div>

            <p style={{
                ...styles.introduction,
                top:'8rem',
                fontSize: '40px',
            }}>{mode}</p>

            <p style={{
                ...styles.introduction,
                top:'19.8rem',
                left:'4rem',
                fontSize:"24px"
            }}>{score}</p>
            

            <div style={styles.gameArea}>
                <div style={outerCircleEffect ? { ...styles.outerCircle, boxShadow: '0 0 20px 10px #FFD700' } : styles.outerCircle}></div>
                <div style={styles.innerCircle}></div>
                {notes.map((note, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.note,
                            left: `${note.x}%`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    >
                        {note.letter}
                    </div>
                ))}
            </div>

            {cherryBlossoms.map((blossom, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        left: `${blossom.x}%`,
                        top: `${blossom.y}%`,
                        width: `${blossom.size}px`,
                        height: `${blossom.size}px`,
                        backgroundColor: 'rgba(255, 182, 193, 0.8)', 
                        clipPath: 'polygon(50% 0%, 70% 15%, 85% 50%, 70% 85%, 50% 100%, 30% 85%, 15% 50%, 30% 15%)',

                        opacity: 0.8 + Math.random() * 0.2, 
                        borderRadius: '50%',
                        animation: 'falling 5s ease-in infinite, rotate 10s linear infinite', 
                        transform: `rotate(${blossom.rotation}deg)`,
                    }}
                ></div>
            ))}

            <ProgressBar audioRef={audioRef} />

            <div style={styles.energyBarContainer}>
                <div style={{ ...styles.energyBar, width: `${energy}%` }}></div>
            </div>
            {feedback && <div style={styles.feedback}>{feedback}</div>}

            {showTimeOut && <TimeOut onResume={() => { setIsPlaying(true); setShowTimeOut(false); }} onExit={() => navigate("/SelectMusic")} />}

            {curtainOpened && (
            <>
            <div
                className={`curtain curtain-left ${curtainOpened ? "opened-left" : ""}`}
                onAnimationEnd={() => {
                setTimeout(() => {
                    navigate("/MusicSettlementPage");
                }, 500);
                }}/>

            <div
                className={`curtain curtain-right ${curtainOpened ? "opened-right" : ""}`}
                />
            </>
        )}
        </div>
    </>
    );
}

const styles = {
    background: {
        width: '78rem',
        height: '40rem',
        backgroundImage: 'url(/单人音游界面.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        zIndex: '-1'
    },
    avatar: {
        position: 'absolute',
        top: '1.8rem',
        left: '2.8rem',
        display: 'block',
        width: '5rem',
        height: '4rem',
        borderRadius: '50%',
        zIndex: '1'
    },
    information: {
        position: 'absolute',
        top: '1.5rem',
        left: '10rem',
        width: '16rem',
        height: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    gameArea: {
        position: 'absolute',
        top: '11rem',
        width: '78rem',
        height: '10rem',
        backgroundColor: 'transparent',
        marginTop: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    outerCircle: {
        position: 'absolute',
        left: '22.5%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '4rem',
        height: '4rem',
        borderRadius: '50%',
        border: '4px solid #FFD700',
        transition: 'box-shadow 0.2s ease-in-out',
    },
    innerCircle: {
        position: 'absolute',
        left: '22.5%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        border: '4px solid #FFA500',
    },
    note: {
        width: '3rem',   
        height: '3rem',  
        borderRadius: '50%',
        backgroundColor: '#FFEDED', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        fontSize: '24px',
        color: 'rgb(9, 25, 248)',
    },
    energyBarContainer: {
        position: 'absolute',
        top: '10rem',
        right: '0.5rem',
        width: '70%',
        height: '20px',
        backgroundColor: '#ddd',
        border: '6px solid white',
        borderRadius: '10px',
    },
    energyBar: {
        height: '100%',
        backgroundColor: ' #32CD32',
        borderRadius: '10px',
    },
    feedback: {
        position: 'absolute',
        left: '25%',
        top: '25%',
        transform: 'translate(-50%, -50%)',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        animation: 'fade 0.5s',
    },
    p: {
        margin: '0',
        paddingLeft: '16px',
        alignItems: 'center',
        fontFamily: 'YouSheBiaoTiHei',
        fontWeight: 'normal',
        letterSpacing: '0em',
        color: ' #FFFFFF',
    },
    people: {
        position: 'absolute',
        left: '35rem',
        top: '22.5rem',
        width: '20rem',
        height: '15rem',
    },
    introduction:{
        position:'absolute',
        left:'3rem',
        color:'#79E2FF',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: '2rem', 
        left: '10rem',
        width: '75%',
        height: '10px',
        backgroundColor: ' #ddd',
        borderRadius: '5px',
    },
    progressBar: {
        height: '100%',
        backgroundColor: ' #00FF00',
        borderRadius: '5px',
    },
    
};
