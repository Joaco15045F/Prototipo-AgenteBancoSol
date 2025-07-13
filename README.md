# 🏦 Agente Bancario IA - Prototipo

Un asistente virtual inteligente para servicios bancarios desarrollado en React con reconocimiento de voz y respuestas contextuales.

## ✨ Características

### 🤖 **Avatar Animado**
- Cara animada con ojos que parpadean
- Boca que se mueve al hablar
- Animaciones cuando responde
- Diseño moderno y profesional

### 💬 **Chat Inteligente**
- Sistema de respuestas contextuales
- Base de datos local de FAQs bancarios
- Respuestas automáticas en español
- Indicador de "escribiendo" durante la carga

### 🎤 **Reconocimiento de Voz**
- Configurado para español (es-ES)
- Transcripción en tiempo real
- Integración completa con el chat
- Botones para iniciar/parar grabación

### 🔊 **Síntesis de Voz**
- El asistente habla las respuestas
- Configurado en español
- Velocidad optimizada para mejor comprensión

### 📱 **Diseño Responsivo**
- Interfaz moderna con gradientes
- Efectos de cristal (glassmorphism)
- Adaptable a móviles y tablets
- Animaciones suaves y profesionales

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd agente-banco

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🧪 Guía de Pruebas

### **Pruebas del Chat**

**Preguntas Básicas (FAQs):**
- "¿Cómo puedo abrir una cuenta?"
- "¿Cuál es la tasa de interés para créditos?"
- "¿Cuál es el horario de atención?"
- "¿Dónde están las agencias?"
- "¿Cuál es el límite de transferencia diario?"

**Preguntas Inteligentes (Keywords):**
- "Necesito un préstamo"
- "Quiero abrir una cuenta de ahorro"
- "¿Cómo hago transferencias?"
- "¿Cuándo están abiertos?"
- "¿Dónde hay una sucursal cerca?"
- "¿Tienen tarjetas de crédito?"
- "¿Cómo funciona la app móvil?"
- "¿Es seguro el banco?"

### **Pruebas de Voz**

1. **Haz clic en "🎙️ Hablar"**
2. **Habla claramente** una pregunta
3. **Haz clic en "⏹️ Parar"** cuando termines
4. **Observa** la transcripción y respuesta automática

### **Pruebas de Funcionalidad**

- ✅ **Enter** para enviar mensajes
- ✅ **Botón de envío** se deshabilita durante carga
- ✅ **Indicador "Escribiendo..."** aparece
- ✅ **Respuestas por voz** automáticas
- ✅ **Avatar animado** cuando responde
- ✅ **Diseño responsivo** en diferentes tamaños

## 📁 Estructura del Proyecto

```
agente-banco/
├── public/
│   ├── data/
│   │   ├── faqs.json          # FAQs básicos
│   │   └── responses.json     # Respuestas inteligentes
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Avatar.jsx         # Avatar animado
│   │   ├── ChatBox.jsx        # Chat principal
│   │   └── VoiceInput.jsx     # Entrada de voz
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos principales
│   └── index.js              # Punto de entrada
└── package.json
```

## 🧠 Sistema de Respuestas

### **Niveles de Inteligencia:**

1. **FAQs Exactos**: Respuestas directas a preguntas específicas
2. **Keywords**: Respuestas basadas en palabras clave
3. **Fallback**: Respuestas por defecto para consultas no reconocidas

### **Categorías de Respuestas:**
- Cuentas bancarias
- Créditos y préstamos
- Transferencias
- Horarios y ubicaciones
- Tarjetas
- Aplicación móvil
- Seguridad

## 🎨 Personalización

### **Modificar Respuestas:**
Edita `public/data/responses.json` para:
- Agregar nuevas FAQs
- Modificar respuestas existentes
- Agregar nuevas keywords
- Personalizar saludos y respuestas por defecto

### **Cambiar Estilos:**
Modifica `src/App.css` para:
- Cambiar colores y gradientes
- Ajustar animaciones
- Modificar el diseño del avatar
- Personalizar la interfaz

## 🔧 Tecnologías Utilizadas

- **React 19.1.0** - Framework principal
- **react-speech-recognition** - Reconocimiento de voz
- **Web Speech API** - Síntesis de voz
- **CSS3** - Estilos y animaciones
- **JSON** - Base de datos local

## 📝 Notas Técnicas

- **Sin dependencias externas**: No requiere APIs de terceros
- **Funciona offline**: Todas las respuestas son locales
- **Configuración de voz**: Optimizada para español
- **Responsive**: Adaptable a todos los dispositivos

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado para demostración de capacidades de IA en servicios bancarios** 🏦✨
