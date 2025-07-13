import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';

const HumanoidAvatar = forwardRef((props, ref) => {
  const avatarRef = useRef();
  const [isTalking, setIsTalking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);

  useImperativeHandle(ref, () => ({
    talk: () => {
      setIsTalking(true);
      setTimeout(() => {
        setIsTalking(false);
      }, 3000);
    }
  }));

  // Animación de parpadeo
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Animación de la boca
  useEffect(() => {
    let mouthInterval;
    if (isTalking) {
      mouthInterval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 200);
    } else {
      setMouthOpen(false);
    }
    return () => clearInterval(mouthInterval);
  }, [isTalking]);

  return (
    <div ref={avatarRef} className="humanoid-avatar-container">
      <div className="humanoid-avatar-frame">
        {/* Cabeza */}
        <div className="humanoid-head">
          {/* Cabello */}
          <div className="humanoid-hair"></div>
          
          {/* Cara */}
          <div className="humanoid-face">
            {/* Ojos */}
            <div className="humanoid-eyes">
              <div className={`humanoid-eye left ${eyeBlink ? 'blinking' : ''}`}>
                <div className="humanoid-pupil"></div>
                <div className="humanoid-eyelash"></div>
              </div>
              <div className={`humanoid-eye right ${eyeBlink ? 'blinking' : ''}`}>
                <div className="humanoid-pupil"></div>
                <div className="humanoid-eyelash"></div>
              </div>
            </div>
            
            {/* Nariz */}
            <div className="humanoid-nose"></div>
            
            {/* Boca */}
            <div className="humanoid-mouth-container">
              <div className={`humanoid-mouth ${mouthOpen ? 'open' : ''}`}>
                <div className="humanoid-lips"></div>
                <div className="humanoid-tongue"></div>
                <div className="humanoid-teeth"></div>
              </div>
            </div>
            
            {/* Mejillas */}
            <div className="humanoid-cheeks">
              <div className="humanoid-cheek left"></div>
              <div className="humanoid-cheek right"></div>
            </div>
          </div>
        </div>
        
        {/* Cuello */}
        <div className="humanoid-neck"></div>
        
        {/* Torso con camisa */}
        <div className="humanoid-torso">
          {/* Camisa */}
          <div className="humanoid-shirt">
            {/* Logo del banco en la camisa */}
            <div className="humanoid-logo">
              <div className="logo-circle">
                <span className="logo-text">BV</span>
              </div>
              <div className="logo-text-full">BANCO VIRTUAL</div>
            </div>
            
            {/* Botones de la camisa */}
            <div className="humanoid-buttons">
              <div className="humanoid-button"></div>
              <div className="humanoid-button"></div>
              <div className="humanoid-button"></div>
            </div>
            
            {/* Bolsillo */}
            <div className="humanoid-pocket"></div>
          </div>
          
          {/* Corbata */}
          <div className="humanoid-tie"></div>
        </div>
        
        {/* Hombros */}
        <div className="humanoid-shoulders">
          <div className="humanoid-shoulder left"></div>
          <div className="humanoid-shoulder right"></div>
        </div>
      </div>
      
      {/* Indicador de estado */}
      <div className={`humanoid-status ${isTalking ? 'active' : ''}`}>
        {isTalking ? '🟢 Hablando...' : '⚪ En espera'}
      </div>
      
      {/* Nombre del asistente */}
      <div className="humanoid-name">
        <div className="name-title">Asistente Virtual</div>
        <div className="name-subtitle">Banco Virtual</div>
      </div>
    </div>
  );
});

export default HumanoidAvatar; 