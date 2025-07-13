# SOLUCIÓN PARA AUDIO EN TÓTEMS ANDROID 12

## 🔧 DIAGNÓSTICO RÁPIDO

### 1. Verificar Configuración del Tótem

#### Configuración del Sistema Android 12
```bash
# Conectar al tótem via ADB
adb connect [IP_DEL_TOTEM]

# Verificar configuración de audio
adb shell settings get system volume_music
adb shell settings get system volume_system
adb shell settings get system volume_ring

# Configurar volúmenes al máximo
adb shell settings put system volume_music 15
adb shell settings put system volume_system 15
adb shell settings put system volume_ring 15

# Verificar que el audio no esté silenciado
adb shell settings get system mute_audio
adb shell settings put system mute_audio 0
```

#### Configuración del Navegador Chrome
1. **Abrir Chrome en el tótem**
2. **Ir a chrome://flags/**
3. **Buscar y habilitar:**
   - `#enable-experimental-web-platform-features`
   - `#enable-web-audio`
   - `#enable-speech-synthesis`
   - `#disable-background-timer-throttling`

4. **Reiniciar Chrome**

### 2. Configuración de Permisos

#### Permisos de Audio en Android 12
```bash
# Verificar permisos de audio
adb shell pm list permissions | grep audio
adb shell pm list permissions | grep microphone

# Otorgar permisos de audio al navegador
adb shell pm grant com.android.chrome android.permission.RECORD_AUDIO
adb shell pm grant com.android.chrome android.permission.MODIFY_AUDIO_SETTINGS
adb shell pm grant com.android.chrome android.permission.ACCESS_NETWORK_STATE
```

#### Configuración de Políticas de Audio
```bash
# Deshabilitar políticas restrictivas de audio
adb shell settings put global policy_control audioOutputAllowed=true
adb shell settings put global policy_control audioInputAllowed=true

# Configurar modo de audio para tótems
adb shell settings put system audio_mode 2
```

### 3. Configuración Específica para Tótems

#### Modo Kiosco con Audio
```bash
# Configurar Chrome en modo kiosco con audio
adb shell am start -n com.android.chrome/.MainActivity \
  --es "kiosk_mode" "true" \
  --es "audio_enabled" "true" \
  --es "autoplay_policy" "no_user_gesture_required"
```

#### Configuración de Audio del Sistema
```bash
# Configurar audio para tótems
adb shell settings put system audio_output_mode 1
adb shell settings put system audio_input_mode 1

# Deshabilitar silencio automático
adb shell settings put system auto_silence 0
adb shell settings put system silence_timeout 0
```

## 🎯 SOLUCIONES ESPECÍFICAS

### Solución 1: Forzar Audio con Web Audio API
```javascript
// Ejecutar en la consola del navegador del tótem
function forceAudioTest() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Activar contexto
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Crear beep de prueba
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    console.log('Audio forzado - deberías escuchar un beep');
  } catch (error) {
    console.error('Error forzando audio:', error);
  }
}

forceAudioTest();
```

### Solución 2: Configurar SpeechSynthesis Manualmente
```javascript
// Ejecutar en la consola del navegador
function configureSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    // Cancelar cualquier síntesis anterior
    window.speechSynthesis.cancel();
    
    // Configurar síntesis
    const utterance = new SpeechSynthesisUtterance('Prueba de audio en tótem');
    utterance.lang = 'es-ES';
    utterance.rate = 0.7;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Eventos
    utterance.onstart = () => console.log('Síntesis iniciada');
    utterance.onend = () => console.log('Síntesis completada');
    utterance.onerror = (e) => console.error('Error síntesis:', e.error);
    
    // Forzar reproducción
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }
}

configureSpeechSynthesis();
```

### Solución 3: Usar HTML5 Audio como Fallback
```javascript
// Crear archivo de audio temporal
function createAudioFallback() {
  const audio = new Audio();
  audio.volume = 1.0;
  
  // Crear un beep usando Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
  
  console.log('Audio fallback ejecutado');
}
```

## 🔍 VERIFICACIÓN DE FUNCIONAMIENTO

### 1. Usar Botones de Prueba en la Aplicación
- **🔊 Prueba Normal**: Audio estándar
- **🎯 Prueba Tótem**: Audio optimizado para tótems
- **🤖 Prueba Android 12**: Audio específico para Android 12
- **🔧 Diagnóstico**: Beep de prueba y logs

### 2. Verificar Logs en Consola
```javascript
// Verificar en la consola del navegador
console.log('=== VERIFICACIÓN DE AUDIO ===');
console.log('User Agent:', navigator.userAgent);
console.log('SpeechSynthesis:', 'speechSynthesis' in window);
console.log('AudioContext:', 'AudioContext' in window);
console.log('WebkitAudioContext:', 'webkitAudioContext' in window);
console.log('Resolución:', window.screen.width, 'x', window.screen.height);
```

### 3. Probar Diferentes Métodos
La aplicación ahora tiene 5 métodos diferentes de audio:
1. **SpeechSynthesis estándar**
2. **SpeechSynthesis para tótems**
3. **Audio con síntesis forzada**
4. **Web Audio API directo**
5. **HTML5 Audio como fallback**

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema: Audio completamente silencioso
**Solución:**
```bash
# Verificar volumen del sistema
adb shell media volume --show --stream 3
adb shell media volume --set 15 --stream 3

# Verificar que no esté en modo silencio
adb shell settings put system mute_audio 0
```

### Problema: Audio funciona en PC pero no en tótem
**Solución:**
```bash
# Configurar permisos específicos para tótem
adb shell settings put global policy_control audioOutputAllowed=true
adb shell settings put system audio_mode 2
```

### Problema: Audio se corta o es intermitente
**Solución:**
```bash
# Deshabilitar optimizaciones de batería
adb shell settings put global app_standby_enabled 0
adb shell settings put global adaptive_battery_management_enabled 0
```

## 📞 SOPORTE TÉCNICO

Si ninguna de las soluciones funciona:

1. **Recopilar logs completos** de la consola del navegador
2. **Verificar configuración del hardware** del tótem
3. **Probar con navegador alternativo** (Firefox, Edge)
4. **Contactar soporte técnico** con información completa del sistema

---

**Nota**: Estas soluciones están específicamente diseñadas para tótems con Android 12. Para otras versiones o sistemas, consultar la documentación correspondiente. 