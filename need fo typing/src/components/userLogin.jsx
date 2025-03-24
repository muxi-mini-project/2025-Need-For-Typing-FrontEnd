import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Squares from './userLoginBackground';

export default function UserLogin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isHidden, setIsHidden] = useState(false);
    const [isPointed, setIsPointed] = useState(false)
    const navigate = useNavigate();
    const divRef = useRef(null); 

    useEffect(() => {
       
        const fromRegister = sessionStorage.getItem('fromRegister');

        if (fromRegister) {
            setIsHidden(true);
            sessionStorage.removeItem('fromRegister'); 
        } else {
           
            const moveTimer = setTimeout(() => {
                document.body.style.overflow = 'hidden';

                if (divRef.current) {
                    let opacity = 1;
                    const fadeOut = () => {
                        opacity -= 0.02;
                        if (divRef.current) divRef.current.style.opacity = opacity;

                        if (opacity > 0) {
                            requestAnimationFrame(fadeOut);
                        } else {
                            setIsHidden(true);
                        }
                    };
                    fadeOut();
                }
            }, 500);

            return () => clearTimeout(moveTimer);
        }
    }, []);

    function register() {
        sessionStorage.setItem('fromRegister', 'true'); 
        navigate('/UserRegister');
    }

    function test() {
        navigate('/CarSelectPage');
    }

    return (
            <>
                {!isHidden && (
                    <div
                        ref={divRef}
                        style={{
                            position: 'absolute',
                            background: 'rgb(184, 225, 249)',
                            width: '78rem',
                            height: '40rem',
                            zIndex: '2',
                            transition: 'transform 1s  ease-out',
                            opacity: 1, 
                        }}
                    />
                )}

                <div style={styles.container}>
                    <Squares
                        speed={0.5}
                        squareSize={40}
                        direction='diagonal'
                        borderColor='#D0EEFF'
                        hoverFillColor='rgb(89, 189, 247)'
                    />

                    <div onClick={register} style={styles.hide} />
                    <img
                        src='/登录改.png'
                        alt='登录'
                        style={{
                            position: 'relative',
                            left: '8.5rem',
                        }}
                    />
                    <input
                        type='text'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder='请输入用户名'
                        style={{
                            ...styles.input,
                            top: '16rem',
                        }}
                    />
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='请输入密码'
                        style={{
                            ...styles.input,
                            top: '22rem',
                        }}
                    />
                    <button
                        onClick={test}
                        onMouseEnter={() => setIsPointed(true)}
                        onMouseLeave={() => setIsPointed(false)}
                        style={{
                            ...styles.background,
                            zIndex: '1',
                            top: '33rem',
                            left: '35rem',
                            cursor: 'pointer',
                            backgroundColor: '#D0EEFF',
                            fontFamily: 'YouSheBiaoTiHei',
                            fontSize: '28px',
                            fontWeight: 'normal',
                            lineHeight: 'normal',
                            letterSpacing: '0.3em',
                            color: '#3D3D3D',
                            border: isPointed ? '0.1px solid #3D3D3D' : 'none',
                            transform: isPointed ? 'translate(0.5rem,0.5rem)' : 'translate(0,0)',
                            transition: 'all 0.1s ease',
                        }}
                    >
                        登录
                    </button>
                    <div
                        style={{
                            ...styles.background,
                            zIndex: '0',
                            top: '33.5rem',
                            left: '35.5rem',
                            backgroundColor: '#7CA5DE',
                        }}
                    />
                </div>
        </>
    );
}

const styles = {
    container: {
        position: 'relative',
        width: '78rem',
        maxWidth: '1200px',
        height: '41rem',
        margin: '0 auto',
        overflow: 'hidden',
        background: 'rgb(201, 201, 201)',
    },
    hide: {
        position: 'absolute',
        zIndex: '1',
        top: '9rem',
        left: '46rem',
        width: '145px',
        height: '70px',
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    input: {
        position: 'absolute',
        paddingLeft: '10px',
        left: '26rem',
        height: '60px',
        width: '450px',
        outline: 'none',
        border: 'none',
        fontSize: '25px',
        backgroundColor: 'rgb(255, 252, 252)',
    },
    background: {
        position: 'absolute',
        width: '120px',
        height: '50px',
        outline: 'none',
        borderRadius: '3px',
    },
};
