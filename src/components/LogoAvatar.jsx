import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../App.css';

const LogoAvatar = forwardRef(({ isUserTalking, isBotTalking }, ref) => {
  const [eyeBlink, setEyeBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Parpadeo automático
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Boca animada al hablar el bot
  useEffect(() => {
    let mouthInterval;
    if (isBotTalking) {
      mouthInterval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 140);
    } else {
      setMouthOpen(false);
    }
    return () => clearInterval(mouthInterval);
  }, [isBotTalking]);

  useImperativeHandle(ref, () => ({
    talk: () => {}
  }));

  return (
    <div className={`logo-avatar-container${isUserTalking ? ' user-talking' : ''}`}> 
      {/* SVG del logo con borde oscuro */}
      <svg className="logo-avatar-bg" viewBox="0 0 320 320" width="220" height="220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 160c0-79.5 64.5-144 144-144s144 64.5 144 144c0 38.5-15.5 73.5-40.5 99.5C238.5 284.5 202.5 304 160 304c-42.5 0-78.5-19.5-103.5-44.5C31.5 233.5 16 198.5 16 160z" fill="#181C23"/>
        <path d="M32 160c0-70.7 57.3-128 128-128s128 57.3 128 128c0 34.2-13.8 65.3-36.2 88.2C227.8 271.2 196.7 288 160 288c-36.7 0-67.8-16.8-91.8-39.8C45.8 225.3 32 194.2 32 160z" fill="url(#paint0_linear)"/>
        <defs>
          <linearGradient id="paint0_linear" x1="64" y1="64" x2="256" y2="256" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD600"/>
            <stop offset="0.5" stopColor="#FF5C97"/>
            <stop offset="1" stopColor="#7B2FF2"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Ojos */}
      <div className={`logo-avatar-eye left${eyeBlink ? ' blinking' : ''}`}></div>
      <div className={`logo-avatar-eye right${eyeBlink ? ' blinking' : ''}`}></div>
      {/* Boca */}
      <div className={`logo-avatar-mouth${mouthOpen ? ' open' : ''}`}></div>
    </div>
  );
});

export default LogoAvatar; 