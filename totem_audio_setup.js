// SCRIPT DE CONFIGURACIÓN AUTOMÁTICA DE AUDIO PARA TÓTEMS ANDROID 12
// Ejecutar este script en la consola del navegador del tótem

console.log('=== CONFIGURACIÓN AUTOMÁTICA DE AUDIO TÓTEM ===');

// Función para detectar el sistema
function detectSystem() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const androidVersion = isAndroid ? 
    parseFloat(navigator.userAgent.match(/Android\s([0-9.]*)/)?.[1] || '0') : 0;
  const isTotem = window.screen.width >= 1920 || window.screen.height >= 1080;
  
  console.log('Sistema detectado:', {
    isAndroid,
    androidVersion,
    isTotem,
    userAgent: navigator.userAgent,
    resolution: `${window.screen.width}x${window.screen.height}`
  });
  
  return { isAndroid, androidVersion, isTotem };
}

// Función para configurar Web Audio API
function configureWebAudio() {
  console.log('Configurando Web Audio API...');
  
  try {
    // Crear contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Activar contexto si está suspendido
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    console.log('AudioContext creado:', audioContext.state);
    
    // Probar audio con un beep
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    console.log('✅ Web Audio API configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error configurando Web Audio API:', error);
    return false;
  }
}

// Función para configurar SpeechSynthesis
function configureSpeechSynthesis() {
  console.log('Configurando SpeechSynthesis...');
  
  if ('speechSynthesis' in window) {
    try {
      // Cancelar síntesis anterior
      window.speechSynthesis.cancel();
      
      // Cargar voces
      const voices = window.speechSynthesis.getVoices();
      console.log('Voces disponibles:', voices.map(v => `${v.name} (${v.lang})`));
      
      // Buscar voz en español
      const spanishVoice = voices.find(voice => 
        voice.lang.includes('es') || voice.lang.includes('ES')
      );
      
      if (spanishVoice) {
        console.log('Voz en español encontrada:', spanishVoice.name);
      } else {
        console.log('No se encontró voz en español, usando voz por defecto');
      }
      
      console.log('✅ SpeechSynthesis configurado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error configurando SpeechSynthesis:', error);
      return false;
    }
  } else {
    console.log('❌ SpeechSynthesis no disponible');
    return false;
  }
}

// Función para probar audio completo
function testAudio() {
  console.log('Probando audio completo...');
  
  const { isAndroid, androidVersion, isTotem } = detectSystem();
  
  // Probar Web Audio API
  const webAudioOk = configureWebAudio();
  
  // Probar SpeechSynthesis
  const speechOk = configureSpeechSynthesis();
  
  if (speechOk) {
    // Probar síntesis de voz
    const utterance = new SpeechSynthesisUtterance('Prueba de audio en tótem Android 12');
    utterance.lang = 'es-ES';
    utterance.rate = isAndroid && androidVersion >= 12 ? 0.7 : 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => console.log('🎤 Síntesis de voz iniciada');
    utterance.onend = () => console.log('✅ Síntesis de voz completada');
    utterance.onerror = (e) => console.error('❌ Error síntesis:', e.error);
    
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 1000);
  }
  
  return { webAudioOk, speechOk };
}

// Función para configurar permisos de audio
function configureAudioPermissions() {
  console.log('Configurando permisos de audio...');
  
  // Solicitar permisos de audio si es necesario
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('✅ Permisos de audio otorgados');
        // Detener el stream ya que solo necesitamos los permisos
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(error => {
        console.log('⚠️ Permisos de audio no otorgados:', error.message);
      });
  }
}

// Función para configurar modo tótem
function configureTotemMode() {
  console.log('Configurando modo tótem...');
  
  // Configurar variables CSS para tótem
  document.documentElement.style.setProperty('--kiosk-mode', 'true');
  document.documentElement.style.setProperty('--android-12-mode', 'true');
  document.documentElement.style.setProperty('--android-totem-mode', 'true');
  
  // Configurar atributos de datos
  document.body.setAttribute('data-totem', 'true');
  document.body.setAttribute('data-android-12', 'true');
  
  console.log('✅ Modo tótem configurado');
}

// Función principal de configuración
function setupTotemAudio() {
  console.log('🚀 Iniciando configuración automática de audio para tótem...');
  
  // Detectar sistema
  const systemInfo = detectSystem();
  
  // Configurar permisos
  configureAudioPermissions();
  
  // Configurar modo tótem
  configureTotemMode();
  
  // Probar audio
  setTimeout(() => {
    const audioTest = testAudio();
    
    console.log('=== RESUMEN DE CONFIGURACIÓN ===');
    console.log('Sistema:', systemInfo);
    console.log('Web Audio API:', audioTest.webAudioOk ? '✅ OK' : '❌ FALLO');
    console.log('SpeechSynthesis:', audioTest.speechOk ? '✅ OK' : '❌ FALLO');
    
    if (audioTest.webAudioOk || audioTest.speechOk) {
      console.log('🎉 Configuración completada - Audio debería funcionar');
    } else {
      console.log('⚠️ Configuración completada - Revisar configuración del sistema');
    }
  }, 2000);
}

// Función para diagnóstico avanzado
function advancedDiagnostic() {
  console.log('=== DIAGNÓSTICO AVANZADO ===');
  
  // Verificar APIs disponibles
  console.log('APIs disponibles:', {
    speechSynthesis: 'speechSynthesis' in window,
    audioContext: 'AudioContext' in window,
    webkitAudioContext: 'webkitAudioContext' in window,
    mediaDevices: 'mediaDevices' in navigator,
    getUserMedia: 'getUserMedia' in navigator.mediaDevices
  });
  
  // Verificar configuración del navegador
  console.log('Configuración del navegador:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  });
  
  // Verificar configuración de pantalla
  console.log('Configuración de pantalla:', {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth
  });
  
  // Verificar configuración de ventana
  console.log('Configuración de ventana:', {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    devicePixelRatio: window.devicePixelRatio
  });
}

// Ejecutar configuración automática
setupTotemAudio();

// Exportar funciones para uso manual
window.totemAudio = {
  setup: setupTotemAudio,
  test: testAudio,
  diagnose: advancedDiagnostic,
  configureWebAudio,
  configureSpeechSynthesis
};

console.log('📋 Funciones disponibles: totemAudio.setup(), totemAudio.test(), totemAudio.diagnose()'); 