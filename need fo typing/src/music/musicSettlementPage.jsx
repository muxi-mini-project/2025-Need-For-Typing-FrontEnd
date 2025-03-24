import { useState, useEffect } from "react";
import CountUp from './countUp'
import MusicReturn from './musicReturn'


export default function Test() {
    const [curtainOpened, setCurtainOpened] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
        setCurtainOpened(true);
        }, 0); 

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <>
            <style>
                {`
                @keyframes curtainOpen {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-100%);
                }
                }

                @keyframes curtainOpenRight {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(100%);
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
                transform: translateX(0);
                }

                .curtain-right {
                right: 0;
                transform: translateX(0);
                }

                .curtain.opened-left {
                animation: curtainOpen 1.5s ease-out forwards;
                }

                .curtain.opened-right {
                animation: curtainOpenRight 1.5s ease-out forwards;
                }
            `}
            </style>

        {curtainOpened && (
            <>
                <div
                    className={`curtain curtain-left ${curtainOpened ? "opened-left" : ""}`}
                />

                <div
                    className={`curtain curtain-right ${curtainOpened ? "opened-right" : ""}`}
                />
            </>
        )}
            <img
                src="/音游结算画面.png"
                alt="音游结算"
                style={styles.backgroundImage}
            />

            <CountUp
              from={0}
              to={100}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
              left='22rem'
            />

            <CountUp
              from={0}
              to={100}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
              left='42rem'
            />

            <CountUp
              from={0}
              to={100}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
              left='64rem'
            />

            <MusicReturn path={"/MusicMainPage"}/>
        </>
    )
}

const styles = {
    backgroundImage: {
        width: '100%',
        height: '40.5rem',
    },
}