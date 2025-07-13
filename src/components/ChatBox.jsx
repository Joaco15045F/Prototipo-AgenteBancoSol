// ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import useLocalAnswer from './useLocalAnswer';
import MessageBubble from './MessageBubble';

export default function ChatBox({
  avatarRef,
  voiceMessage,
  onBotTalking,
  onVoiceMessageHandled,
  showOnlyFaqBlock,
  hideFaqBlock,
  showOnlyFaqBlockAlways,
  onFaqClick, // NUEVO: función para enviar pregunta FAQ al chat principal
  faqQuestion, // NUEVO: pregunta FAQ seleccionada
  onFaqQuestionHandled // NUEVO: para limpiar la pregunta
}) {
  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responsesData, setResponsesData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [showFaqs, setShowFaqs] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState('');
  const [audioMapping, setAudioMapping] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Manejar mensajes pendientes
  useEffect(() => {
    if (pendingMessages.length > 0) {
      setMessages(prev => {
        const newMessages = [...prev, ...pendingMessages];
        return newMessages;
      });
      setPendingMessages([]); // Limpiar mensajes pendientes
    }
  }, [pendingMessages]);

  // Inicializar voces de síntesis de voz
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Cargar voces disponibles
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voces disponibles:', voices.map(v => `${v.name} (${v.lang})`));
        
        const spanishVoice = voices.find(voice => 
          voice.lang.includes('es') || voice.lang.includes('ES')
        );
        
        if (spanishVoice) {
          console.log('Voz en español encontrada:', spanishVoice.name);
        } else {
          console.log('No se encontró voz en español, usando voz por defecto');
        }
      };
      
      // Las voces pueden no estar disponibles inmediatamente
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    // Detectar si estamos en un tótem/kiosco con soporte para Android 12
    const detectKiosk = () => {
      // Detectar Android específicamente
      const isAndroid = /Android/i.test(navigator.userAgent);
      const androidVersion = isAndroid ? 
        parseFloat(navigator.userAgent.match(/Android\s([0-9.]*)/)?.[1] || '0') : 0;
      
      // Detectar características de tótem
      const isKiosk = 
        window.navigator.standalone || // iOS
        window.matchMedia('(display-mode: standalone)').matches || // PWA
        window.screen.width >= 1920 || // Pantalla grande
        window.screen.height >= 1080 || // Pantalla alta
        window.orientation !== undefined || // Dispositivo móvil/tablet
        (isAndroid && androidVersion >= 12) || // Android 12+
        document.referrer === '' || // Sin referrer (modo kiosco)
        window.location.href.includes('kiosk') || // URL contiene kiosk
        window.location.href.includes('totem'); // URL contiene totem
      
      console.log('Detectado tótem/kiosco:', isKiosk);
      console.log('Es Android:', isAndroid);
      console.log('Versión Android:', androidVersion);
      console.log('Resolución:', window.screen.width, 'x', window.screen.height);
      console.log('Orientación:', window.orientation);
      console.log('User Agent:', navigator.userAgent);
      
      if (isKiosk) {
        // Configuraciones específicas para tótems
        document.body.style.setProperty('--kiosk-mode', 'true');
        
        // Configuraciones específicas para Android 12
        if (isAndroid && androidVersion >= 12) {
          document.body.style.setProperty('--android-12-mode', 'true');
          console.log('Modo Android 12+ activado');
          
          // Configuraciones específicas para Android 12 en tótems
          if (window.screen.width >= 1920 || window.screen.height >= 1080) {
            document.body.style.setProperty('--android-totem-mode', 'true');
            console.log('Modo tótem Android 12+ activado');
          }
        }
        
        console.log('Modo tótem activado');
      }
    };
    
    detectKiosk();
  }, []);

  useEffect(() => {
    // Cargar respuestas inteligentes
    fetch('/data/responses.json')
      .then(response => response.json())
      .then(data => {
        setResponsesData(data);
        // Usar las FAQs del archivo responses.json en lugar de faqs.json
        if (data.faqs) {
          setFaqs(data.faqs);
        }
        setFetchError(false);
      })
      .catch(error => {
        setFetchError(true);
        console.error('Error cargando respuestas:', error);
      });

    // Cargar mapeo de audio
    fetch('/data/audio-mapping.json')
      .then(response => response.json())
      .then(data => {
        setAudioMapping(data);
        console.log('✅ Mapeo de audio cargado:', data);
        console.log('📋 Preguntas disponibles:', Object.keys(data.faq_audio_mapping));
      })
      .catch(error => {
        console.warn('❌ No se pudo cargar el mapeo de audio:', error);
      });
  }, []);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (responsesData) {
      const randomGreeting = responsesData.greetings[Math.floor(Math.random() * responsesData.greetings.length)];
      const welcomeMessage = {
        role: 'assistant',
        content: randomGreeting,
        id: Date.now() + Math.random() // ID único
      };
      setMessages([welcomeMessage]);
    }
  }, [responsesData]);

  // Reemplazar findLocalAnswer por el hook
  const findLocalAnswer = useLocalAnswer(responsesData);

  // 1. Función para desbloquear speechSynthesis con la primera interacción
  const unlockSpeechSynthesis = () => {
    try {
      if ('speechSynthesis' in window && window.speechSynthesis.speak) {
        const utterance = new window.SpeechSynthesisUtterance('');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
        console.log('✅ Voz desbloqueada con interacción');
      }
    } catch (error) {
      console.warn('⚠️ Error al desbloquear voz:', error);
    }
  };

  // 2. handleBotResponse actualizado
  const handleBotResponse = (messageText) => {
    unlockSpeechSynthesis(); // <- desbloquea voz al enviar mensaje

    if (!messageText.trim() || !responsesData) return;
    
    // Buscar respuesta específica en las FAQs primero
    let answer = null;
    if (responsesData.faqs) {
      const faqMatch = responsesData.faqs.find(faq => 
        faq.pregunta.toLowerCase() === messageText.toLowerCase()
      );
      if (faqMatch) {
        answer = faqMatch.respuesta;
      }
    }
    
    // Si no se encuentra en FAQs, usar el sistema de respuestas inteligentes
    if (!answer) {
      answer = findLocalAnswer(messageText);
    }
    
    const userMessage = { 
      role: 'user', 
      content: messageText,
      id: Date.now() + Math.random()
    };
    
    const aiMessage = { 
      role: 'assistant', 
      content: answer,
      id: Date.now() + Math.random()
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    if (!isAtBottom) setHasNewMessages(true);
    setInput('');
    setIsLoading(true);
    if (onBotTalking) onBotTalking(true);
    setLastBotMessage(answer);
    console.log('💬 Respuesta del bot:', answer);

    speak(answer, () => {
      if (onBotTalking) onBotTalking(false);
      setIsLoading(false);
      if (inputRef.current) inputRef.current.focus();
    }, { question: messageText });
    if (avatarRef && avatarRef.current) avatarRef.current.talk();
  };

  // Fallback beep (solo una vez en el archivo)
  const fallbackBeep = (onEnd) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      oscillator.onended = () => {
        if (onEnd) onEnd();
      };
    } catch (error) {
      if (onEnd) onEnd();
    }
  };

  // Nueva función para reproducir audio pre-grabado
  const playAudioFile = (filename, onEnd) => {
    console.log('🎵 Iniciando reproducción de audio:', filename);
    
    if (!filename) {
      console.log('❌ No hay nombre de archivo');
      if (onEnd) onEnd();
      return;
    }

    try {
      // Detener audio anterior si está reproduciéndose
      if (currentAudio) {
        console.log('⏹️ Deteniendo audio anterior');
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audioUrl = `/audio/${filename}`;
      console.log('🔗 URL del audio:', audioUrl);
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      audio.onended = () => {
        console.log('✅ Audio completado exitosamente');
        setCurrentAudio(null);
        setAudioBlocked(false);
        if (onEnd) onEnd();
      };

      audio.onerror = (error) => {
        console.error('❌ Error reproduciendo audio:', error);
        console.log('🔧 Detalles del error:', {
          error: error.message,
          filename: filename,
          audioUrl: audioUrl
        });
        setAudioBlocked(true);
        setCurrentAudio(null);
        // Fallback a beep si el audio falla
        console.log('🔄 Usando beep como fallback');
        fallbackBeep(onEnd);
      };

      // Intentar reproducir el audio
      console.log('▶️ Intentando reproducir audio...');
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('❌ Error iniciando audio:', error);
          console.log('🔧 Detalles del error de reproducción:', {
            error: error.message,
            name: error.name,
            filename: filename
          });
          setAudioBlocked(true);
          setCurrentAudio(null);
          console.log('🔄 Usando beep como fallback por error de reproducción');
          fallbackBeep(onEnd);
        });
      }

    } catch (error) {
      console.error('Error configurando audio:', error);
      setAudioBlocked(true);
      fallbackBeep(onEnd);
    }
  };

  // Función para encontrar el archivo de audio correspondiente
  const findAudioFile = (question) => {
    console.log('🔍 Buscando audio para pregunta:', question);
    
    if (!audioMapping || !audioMapping.faq_audio_mapping) {
      console.log('❌ No hay mapeo de audio disponible');
      return null;
    }

    // Normalizar la pregunta (quitar signos de interrogación y espacios extra)
    const normalizeText = (text) => {
      return text.toLowerCase()
        .trim()
        .replace(/[¿?]/g, '') // Quitar signos de interrogación
        .replace(/\s+/g, ' '); // Normalizar espacios
    };

    const normalizedQuestion = normalizeText(question);
    console.log('🔍 Pregunta normalizada:', normalizedQuestion);

    // Buscar coincidencia exacta primero
    const exactMatch = audioMapping.faq_audio_mapping[question];
    if (exactMatch) {
      console.log('✅ Coincidencia exacta encontrada:', exactMatch);
      return exactMatch;
    }

    // Buscar coincidencia con texto normalizado
    for (const [faqQuestion, audioFile] of Object.entries(audioMapping.faq_audio_mapping)) {
      const normalizedFaqQuestion = normalizeText(faqQuestion);
      console.log('  Comparando con:', normalizedFaqQuestion);
      
      if (normalizedFaqQuestion === normalizedQuestion) {
        console.log('✅ Coincidencia normalizada encontrada:', audioFile);
        return audioFile;
      }
    }

    // Buscar coincidencia parcial (si la pregunta contiene palabras clave)
    const questionWords = normalizedQuestion.split(' ');
    for (const [faqQuestion, audioFile] of Object.entries(audioMapping.faq_audio_mapping)) {
      const normalizedFaqQuestion = normalizeText(faqQuestion);
      const faqWords = normalizedFaqQuestion.split(' ');
      
      // Si al menos 3 palabras coinciden, considerarlo una coincidencia
      const matchingWords = questionWords.filter(word => 
        faqWords.includes(word) && word.length > 2
      );
      
      if (matchingWords.length >= 3) {
        console.log('✅ Coincidencia parcial encontrada (palabras clave):', audioFile);
        console.log('  Palabras coincidentes:', matchingWords);
        return audioFile;
      }
    }

    console.log('❌ No se encontró archivo de audio para:', question);
    return null;
  };

  // Modifica speak para usar archivos de audio pre-grabados
  const speak = (text, onEnd, options = {}) => {
    let toSpeak = typeof text === 'object' ? text.text || '' : text;
    if (!toSpeak || toSpeak.trim() === '') {
      fallbackBeep(onEnd);
      return;
    }

    // Buscar audio basado en la pregunta original, no en la respuesta
    const currentQuestion = options.question || lastBotMessage;
    console.log('🔍 Buscando audio para pregunta:', currentQuestion);
    if (currentQuestion && findAudioFile(currentQuestion)) {
      const audioFile = findAudioFile(currentQuestion);
      console.log('🎵 Reproduciendo audio pre-grabado:', audioFile);
      playAudioFile(audioFile, onEnd);
      return;
    } else {
      console.log('🔄 No se encontró audio pre-grabado, usando síntesis de voz');
    }

    // Fallback a síntesis de voz si no hay audio pre-grabado
    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(toSpeak);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
              utterance.onend = () => {
          setAudioBlocked(false);
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          setAudioBlocked(true);
          if (options.allowBeep !== false) fallbackBeep(onEnd);
        };
      window.speechSynthesis.speak(utterance);

      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          setAudioBlocked(true);
          if (options.allowBeep !== false) fallbackBeep(onEnd);
        }
      }, 1000);
    } catch (e) {
      setAudioBlocked(true);
      if (options.allowBeep !== false) fallbackBeep(onEnd);
    }
  };
  
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBotResponse(input);
    }
  };

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Integración con entrada de voz (solo una vez por mensaje)
  useEffect(() => {
    if (voiceMessage && responsesData) {
      handleBotResponse(voiceMessage);
      if (onVoiceMessageHandled) onVoiceMessageHandled();
    }
    // eslint-disable-next-line
  }, [voiceMessage, responsesData]);

  // 1. Nuevo efecto para hacer scroll al primer mensaje (bienvenida)
  useEffect(() => {
    // Si solo hay un mensaje (bienvenida), haz scroll automático sin animación
    if (messages.length === 1 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  // Manejar click en pregunta frecuente: enviar al chat y responder
  const handleFaqClick = (pregunta) => {
    console.log('🖱️ Clic en FAQ:', pregunta);
    unlockSpeechSynthesis(); // <- desbloquea voz al tocar FAQ

    if (!pregunta || !responsesData) return;
    
    // Buscar respuesta específica en las FAQs primero
    let answer = null;
    if (responsesData.faqs) {
      const faqMatch = responsesData.faqs.find(faq => 
        faq.pregunta.toLowerCase() === pregunta.toLowerCase()
      );
      if (faqMatch) {
        answer = faqMatch.respuesta;
      }
    }
    // Si no se encuentra en FAQs, usar el sistema de respuestas inteligentes
    if (!answer) {
      answer = findLocalAnswer(pregunta);
    }
    // Agregar ambos mensajes de una vez
    const userMessage = { 
      role: 'user', 
      content: pregunta,
      id: Date.now() + Math.random() // ID único
    };
    
    const aiMessage = { 
      role: 'assistant', 
      content: answer,
      id: Date.now() + Math.random() // ID único
    };
    
    // Usar setPendingMessages para manejar la actualización
    setPendingMessages([userMessage, aiMessage]);
    
    setInput('');
    setShowFaqs(false);
    setIsLoading(true);
    if (onBotTalking) onBotTalking(true);
    
    // No beep si la voz falla al responder FAQ
    speak(answer, () => {
      if (onBotTalking) onBotTalking(false);
      setIsLoading(false);
      if (inputRef.current) inputRef.current.focus();
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
      }, 50);
    }, { allowBeep: false });
    if (avatarRef && avatarRef.current) {
      avatarRef.current.talk();
    }
  };

  useEffect(() => {
    // Solo hacer scroll automático si el usuario está al final del chat
    if (messagesEndRef.current && isAtBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Detectar si hay scroll disponible
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      const hasScroll = messagesContainer.scrollHeight > messagesContainer.clientHeight;
      const isScrolledUp = messagesContainer.scrollTop < messagesContainer.scrollHeight - messagesContainer.clientHeight - 100;
      
      messagesContainer.classList.toggle('has-scroll', hasScroll);
      setShowScrollButton(hasScroll && isScrolledUp);
      
      // Agregar listener para detectar scroll
      const handleScroll = () => {
        const scrollTop = messagesContainer.scrollTop;
        const scrollHeight = messagesContainer.scrollHeight;
        const clientHeight = messagesContainer.clientHeight;
        
        // Detectar si está al final (con un margen de 50px)
        const atBottom = scrollTop + clientHeight >= scrollHeight - 50;
        setIsAtBottom(atBottom);
        
        // Limpiar indicador de mensajes nuevos cuando va al final
        if (atBottom && hasNewMessages) {
          setHasNewMessages(false);
        }
        
        const isScrolledUp = scrollTop < scrollHeight - clientHeight - 100;
        setShowScrollButton(hasScroll && isScrolledUp);
      };
      
      messagesContainer.addEventListener('scroll', handleScroll);
      
      return () => {
        messagesContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [messages, isAtBottom]);

  // Si recibimos una pregunta FAQ desde App, la procesamos
  React.useEffect(() => {
    if (faqQuestion && !showOnlyFaqBlockAlways) {
      handleBotResponse(faqQuestion);
      if (onFaqQuestionHandled) onFaqQuestionHandled();
    }
    // eslint-disable-next-line
  }, [faqQuestion]);

  if (showOnlyFaqBlockAlways) {
    return (
      <div className="faq-block-encabezado faq-block-always">
        <div className="faq-suggestions" aria-label="Listado de preguntas frecuentes">
          {faqs.map((faq, idx) => (
            <button
              key={idx}
              type="button"
              className="faq-suggestion-btn"
              onClick={() => onFaqClick && onFaqClick(faq.pregunta)} // ENVÍA LA PREGUNTA AL CHAT PRINCIPAL
              aria-label={`Sugerencia: ${faq.pregunta}`}
            >
              {faq.pregunta}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showOnlyFaqBlock) {
    return (
      <div className="faq-block-encabezado">
        <button
          className="faq-toggle-btn"
          onClick={() => setShowFaqs(v => !v)}
          aria-expanded={showFaqs}
          aria-controls="faq-list"
        >
          {showFaqs ? 'Ocultar Preguntas Frecuentes' : 'Preguntas Frecuentes'}
        </button>
        {showFaqs && faqs.length > 0 && (
          <div id="faq-list" className="faq-suggestions" aria-label="Listado de preguntas frecuentes">
            {faqs.map((faq, idx) => (
              <button
                key={idx}
                type="button"
                className="faq-suggestion-btn"
                onClick={() => handleFaqClick(faq.pregunta)}
                aria-label={`Sugerencia: ${faq.pregunta}`}
              >
                {faq.pregunta}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {fetchError && (
        <div className="error-message" role="alert" aria-live="assertive">
          No se pudieron cargar las respuestas automáticas. Por favor, recarga la página o intenta más tarde.
        </div>
      )}
      <div className="chatbox-main-layout">
        <div className="chatbox-messages-area">
          <div className="chat-outer">
            <div className="messages-container">
              {messages.map((msg, i) => (
                <MessageBubble 
                  key={msg.id || `${msg.role}-${i}-${msg.content.substring(0, 20)}`} 
                  content={msg.content} 
                  role={msg.role} 
                />
              ))}
              <div ref={messagesEndRef} />
              {isLoading && (
                <div className="bubble bot">
                  <span className="typing">Escribiendo...</span>
                </div>
              )}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className={`scroll-to-bottom-btn ${hasNewMessages ? 'has-new-messages' : ''}`}
                  aria-label="Ir al final del chat"
                >
                  ⬇️
                </button>
              )}
            </div>
            <div className="input-container">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta aquí..."
                disabled={isLoading || !responsesData}
                aria-label="Campo de entrada para preguntas"
                tabIndex={0}
                ref={inputRef}
              />
              <button 
                onClick={() => handleBotResponse(input)} 
                disabled={isLoading || !input.trim() || !responsesData}
                aria-label="Enviar mensaje"
                tabIndex={0}
              >
                {isLoading ? '⏳' : '📤'}
              </button>
              
            </div>
          </div>
        </div>
        {!hideFaqBlock && (
          <div className="faq-sidebar">
            <button
              className="faq-toggle-btn"
              onClick={() => setShowFaqs(v => !v)}
              aria-expanded={showFaqs}
              aria-controls="faq-list"
            >
              {showFaqs ? 'Ocultar Preguntas Frecuentes' : 'Preguntas Frecuentes'}
            </button>
            {showFaqs && faqs.length > 0 && (
              <div id="faq-list" className="faq-suggestions" aria-label="Listado de preguntas frecuentes">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="faq-suggestion-btn"
                    onClick={() => handleFaqClick(faq.pregunta)}
                    aria-label={`Sugerencia: ${faq.pregunta}`}
                  >
                    {faq.pregunta}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
