// Avatar.jsx
import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';

const Avatar = forwardRef((props, ref) => {
  const avatarRef = useRef();
  const [isTalking, setIsTalking] = useState(false);
  const [mouthPosition, setMouthPosition] = useState(0);

  useImperativeHandle(ref, () => ({
    talk: () => {
      setIsTalking(true);
      setTimeout(() => {
        setIsTalking(false);
      }, 3000);
    }
  }));

  // Animación de la boca cuando habla
  useEffect(() => {
    let interval;
    if (isTalking) {
      interval = setInterval(() => {
        setMouthPosition(prev => prev === 0 ? 1 : 0);
      }, 200);
    } else {
      setMouthPosition(0);
    }
    return () => clearInterval(interval);
  }, [isTalking]);

  return (
    <div ref={avatarRef} className="avatar-container">
      <div className="avatar-frame">
        <div className="avatar-photo">
          {/* Foto de identificación simulada */}
          <div className="avatar-face">
            <div className="avatar-hair"></div>
            <div className="avatar-forehead"></div>
            <div className="avatar-eyes">
              <div className="avatar-eye left">
                <div className="avatar-pupil"></div>
              </div>
              <div className="avatar-eye right">
                <div className="avatar-pupil"></div>
              </div>
            </div>
            <div className="avatar-nose"></div>
            <div className="avatar-mouth-container">
              <div className={`avatar-mouth ${isTalking ? 'talking' : ''}`}>
                <div className="avatar-lips"></div>
                <div className="avatar-tongue"></div>
              </div>
            </div>
            <div className="avatar-chin"></div>
          </div>
        </div>
        
        {/* Marco de identificación */}
        <div className="avatar-id-frame">
          <div className="avatar-id-header">
            <div className="avatar-id-title">BANCO VIRTUAL</div>
            <div className="avatar-id-subtitle">Asistente Virtual</div>
          </div>
          <div className="avatar-id-footer">
            <div className="avatar-id-number">ID: 2024-001</div>
          </div>
        </div>
      </div>
      
      {/* Indicador de estado */}
      <div className={`avatar-status ${isTalking ? 'active' : ''}`}>
        {isTalking ? '🟢 Hablando...' : '⚪ En espera'}
      </div>
    </div>
  );
});

export default Avatar;
