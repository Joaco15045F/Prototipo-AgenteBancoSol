import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import LogoAvatar from './components/LogoAvatar';
import ChatBox from './components/ChatBox';
import VoiceInput from './components/VoiceInput';

function App() {
  const avatarRef = useRef();
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [isBotTalking, setIsBotTalking] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState(null);
  const [isAndroid12, setIsAndroid12] = useState(false);
  const [isAndroidTotem, setIsAndroidTotem] = useState(false);

  // Manejar inicio y fin de grabación de voz
  const handleVoiceStart = () => setIsUserTalking(true);
  const handleVoiceStop = () => setIsUserTalking(false);

  // Recibe el transcript de voz y lo pasa directo al chat
  const handleVoiceTranscript = (transcript) => {
    if (transcript.trim()) {
      setVoiceMessage(transcript);
    }
  };

  // Recibe el estado de bot hablando desde ChatBox
  const handleBotTalking = (talking) => setIsBotTalking(talking);

  // Detectar Android 12 y configuraciones de tótem
  useEffect(() => {
    const detectAndroid12 = () => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const androidVersion = isAndroid ? 
        parseFloat(navigator.userAgent.match(/Android\s([0-9.]*)/)?.[1] || '0') : 0;
      
      const isLargeScreen = window.screen.width >= 1920 || window.screen.height >= 1080;
      const isTotemMode = isLargeScreen || 
        window.navigator.standalone || 
        window.matchMedia('(display-mode: standalone)').matches;
      
      setIsAndroid12(isAndroid && androidVersion >= 12);
      setIsAndroidTotem(isAndroid && androidVersion >= 12 && isTotemMode);
      
      console.log('Detección Android 12:', {
        isAndroid,
        androidVersion,
        isLargeScreen,
        isTotemMode,
        isAndroid12: isAndroid && androidVersion >= 12,
        isAndroidTotem: isAndroid && androidVersion >= 12 && isTotemMode
      });
    };
    
    detectAndroid12();
    
    // Re-detectar en cambios de orientación
    window.addEventListener('orientationchange', detectAndroid12);
    window.addEventListener('resize', detectAndroid12);
    
    return () => {
      window.removeEventListener('orientationchange', detectAndroid12);
      window.removeEventListener('resize', detectAndroid12);
    };
  }, []);

  return (
    <div 
      className="App"
      data-android-12={isAndroid12}
      data-android-totem={isAndroidTotem}
    >
      {/* HEADER - TÍTULO */}
      <header className="App-header">
        <span className="header-title">Atención al cliente "Banco Sol"</span> 
        <img src="/logo192.png" alt="Banco Sol Logo" className="header-logo" />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        {/* AVATAR CENTRADO */}
        <div className="avatar-section">
          <div className="avatar-standalone">
            <LogoAvatar 
              ref={avatarRef} 
              isUserTalking={isUserTalking} 
              isBotTalking={isBotTalking} 
            />
          </div>
        </div>

        {/* CHAT SECTION */}
        <div className="chat-section">
          <div className="chat-outer">
            <ChatBox
              avatarRef={avatarRef}
              voiceMessage={voiceMessage}
              onBotTalking={handleBotTalking}
              onVoiceMessageHandled={() => setVoiceMessage(null)}
              hideFaqBlock
              faqQuestion={faqQuestion}
              onFaqQuestionHandled={() => setFaqQuestion(null)}
            />
            <VoiceInput 
              onTranscript={handleVoiceTranscript} 
              onStart={handleVoiceStart} 
              onStop={handleVoiceStop} 
            />
          </div>
        </div>

        {/* PREGUNTAS FRECUENTES */}
        <div className="faq-section">
          <ChatBox
            avatarRef={avatarRef}
            onBotTalking={handleBotTalking}
            onVoiceMessageHandled={() => setVoiceMessage(null)}
            showOnlyFaqBlockAlways
            onFaqClick={setFaqQuestion}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="App-footer">
        <p>© 2025 Banco Sol - Asistente IA</p>
      </footer>
    </div>
  );
}

export default App;
