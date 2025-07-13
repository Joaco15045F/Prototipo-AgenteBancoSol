// VoiceInput.jsx
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function VoiceInput({ onTranscript, onStart, onStop }) {
  const { transcript, resetTranscript } = useSpeechRecognition({
    commands: [],
    continuous: false,
    language: 'es-ES'
  });

  const [isListening, setIsListening] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleStart = () => {
    resetTranscript();
    setIsListening(true);
    if (onStart) onStart();
    SpeechRecognition.startListening({ 
      continuous: false,
      language: 'es-ES',
      interimResults: false
    });
    setShowTranscript(false);
  };

  const handleStop = () => {
    setIsListening(false);
    if (onStop) onStop();
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      onTranscript(transcript);
      setShowTranscript(true);
      setTimeout(() => setShowTranscript(false), 1500);
    }
  };

  return (
    <div className="voice-container">
      <button 
        onClick={isListening ? handleStop : handleStart}
        className={isListening ? 'listening' : ''}
      >
        {isListening ? '⏹️ Parar' : '🎙️ Hablar'}
      </button>
      <p>{isListening ? 'Escuchando...' : ''}</p>
      {showTranscript && transcript && (
        <div className="transcript">
          <strong>Transcripción:</strong> {transcript}
        </div>
      )}
    </div>
  );
}
