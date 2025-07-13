// Configuración del Agente Bancario IA
export const CONFIG = {
  // Configuración del banco
  bank: {
    name: "Banco Virtual",
    phone: "800-123-4567",
    website: "www.bancovirtual.com",
    email: "contacto@bancovirtual.com"
  },

  // Configuración de voz
  voice: {
    language: 'es-ES',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0
  },

  // Configuración del avatar
  avatar: {
    blinkInterval: 3000, // milisegundos
    talkDuration: 2000,  // milisegundos
    pulseColor: '#4CAF50'
  },

  // Configuración del chat
  chat: {
    typingDelay: 1000,   // milisegundos
    maxMessages: 50,     // máximo de mensajes en el historial
    autoScroll: true
  },

  // Configuración de respuestas
  responses: {
    dataFile: '/data/responses.json',
    fallbackEnabled: true,
    keywordMatching: true,
    exactMatchThreshold: 3 // palabras mínimas para coincidencia exacta
  },

  // Configuración de la interfaz
  ui: {
    theme: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4CAF50',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    animations: {
      enabled: true,
      duration: 300
    }
  },

  // Configuración de desarrollo
  development: {
    debug: false,
    logResponses: false,
    simulateDelay: true
  }
};

// Funciones de utilidad
export const getRandomGreeting = (greetings) => {
  return greetings[Math.floor(Math.random() * greetings.length)];
};

export const getRandomFallback = (fallbacks) => {
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

export const simulateTyping = (callback, delay = CONFIG.chat.typingDelay) => {
  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve();
    }, delay);
  });
}; 