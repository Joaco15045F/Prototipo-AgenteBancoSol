# Agente Bancario IA - Banco Sol

Un asistente virtual inteligente para atención al cliente bancario, desarrollado con React y tecnologías modernas.

## 🚀 Características

- **Chat interactivo** con respuestas inteligentes
- **Síntesis de voz** en español
- **Reconocimiento de voz** para entrada de comandos
- **Preguntas frecuentes** con respuestas automáticas
- **Avatar animado** con expresiones faciales
- **Interfaz responsiva** para diferentes dispositivos
- **Soporte para tótems** y pantallas grandes

## 🛠️ Tecnologías

- React 19
- Speech Recognition API
- Speech Synthesis API
- CSS3 con animaciones
- Responsive Design

## 📦 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd agente-banco
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta en desarrollo:**
   ```bash
   npm start
   ```

4. **Construye para producción:**
   ```bash
   npm run build
   ```

## 🌐 Despliegue

### Opción 1: Netlify (Recomendado)

1. **Sube tu código a GitHub**
2. **Ve a [Netlify](https://netlify.com)**
3. **Haz clic en "Add new site" > "Import an existing project"**
4. **Conecta tu repositorio de GitHub**
5. **Configuración automática:**
   - Build command: `npm run build`
   - Publish directory: `build`
6. **¡Listo! Tu sitio estará disponible en una URL como: `https://tu-proyecto.netlify.app`**

### Opción 2: Vercel

1. **Sube tu código a GitHub**
2. **Ve a [Vercel](https://vercel.com)**
3. **Haz clic en "Add New Project"**
4. **Importa tu repositorio**
5. **Vercel detectará automáticamente que es un proyecto React**
6. **¡Listo! Tu sitio estará disponible en una URL como: `https://tu-proyecto.vercel.app`**

## 📁 Estructura del Proyecto

```
agente-banco/
├── public/
│   ├── data/
│   │   ├── responses.json      # Respuestas del bot
│   │   └── audio-mapping.json  # Mapeo de archivos de audio
│   ├── audio/                  # Archivos de audio MP3
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatBox.jsx         # Componente principal del chat
│   │   ├── LogoAvatar.jsx      # Avatar animado
│   │   ├── VoiceInput.jsx      # Entrada de voz
│   │   └── MessageBubble.jsx   # Burbujas de mensaje
│   ├── App.jsx                 # Componente principal
│   └── App.css                 # Estilos principales
└── package.json
```

## 🎯 Funcionalidades

### Chat Inteligente
- Respuestas automáticas basadas en palabras clave
- Sistema de preguntas frecuentes
- Respuestas contextuales

### Voz
- Síntesis de voz en español
- Reconocimiento de voz para comandos
- Archivos de audio predefinidos

### Interfaz
- Diseño responsivo
- Animaciones suaves
- Soporte para pantallas táctiles

## 🔧 Configuración

### Personalizar Respuestas
Edita `public/data/responses.json` para modificar:
- Preguntas frecuentes
- Respuestas inteligentes
- Mensajes de bienvenida

### Personalizar Audio
Edita `public/data/audio-mapping.json` para:
- Mapear preguntas a archivos de audio
- Configurar audio de bienvenida y fallback

## 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Dispositivos móviles
- ✅ Pantallas táctiles
- ✅ Tótems y kioscos

## 🚨 Notas Importantes

- **HTTPS requerido** para funcionalidades de voz
- **Permisos de micrófono** necesarios para reconocimiento de voz
- **Navegadores modernos** recomendados para mejor experiencia

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Desarrollado para Banco Sol** 🏦
