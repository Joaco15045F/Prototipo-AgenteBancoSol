import { useCallback } from 'react';

export default function useLocalAnswer(responsesData) {
  return useCallback((question) => {
    if (!responsesData) return null;
    const lowerQuestion = question.toLowerCase();
    // Ejemplo enriquecido: ubicación/agencias
    if (lowerQuestion.includes('dónde') && lowerQuestion.includes('agencias')) {
      return {
        text: "Contamos con más de 150 agencias en toda Bolivia. Puedes encontrar la sucursal más cercana en nuestro mapa interactivo.",
        link: "https://www.bancosol.com.bo/agencias",
        linkLabel: "Ver mapa de sucursales"
      };
    }
    // Ejemplo enriquecido: app móvil
    if (lowerQuestion.includes('app') || lowerQuestion.includes('aplicación móvil') || lowerQuestion.includes('celular')) {
      return {
        text: "Nuestra app móvil te permite hacer transferencias, consultar saldos y mucho más. Descárgala aquí:",
        image: "https://play-lh.googleusercontent.com/1w6QwKkQwKkQwKkQwKkQwKkQwKkQwKkQwKk=w240-h480-rw", // Imagen ejemplo
        link: "https://play.google.com/store/apps/details?id=com.bancosol.app",
        linkLabel: "Descargar app en Google Play"
      };
    }
    // Ejemplo enriquecido: contacto
    if (lowerQuestion.includes('contacto') || lowerQuestion.includes('servicio al cliente')) {
      return {
        text: "Puedes contactar con nuestro servicio al cliente llamando al 800-123-4567 o escribiendo a info@bancosol.com.bo",
        actions: [
          { label: "Llamar", onClick: () => window.open('tel:8001234567', '_self') },
          { label: "Enviar correo", onClick: () => window.open('mailto:info@bancosol.com.bo', '_blank') }
        ]
      };
    }
    // Respuestas directas simples
    if (lowerQuestion.includes('horario') && lowerQuestion.includes('atención')) {
      return "Nuestras sucursales atienden de lunes a viernes de 8:00 a 16:00 y los sábados de 8:00 a 12:00. El servicio de cajeros automáticos está disponible 24/7. Nuestro centro de atención telefónica funciona de lunes a domingo de 7:00 a 22:00.";
    }
    if (lowerQuestion.includes('abrir') && lowerQuestion.includes('cuenta')) {
      return "Para abrir una cuenta, necesitas presentar tu cédula de identidad, un comprobante de domicilio y un comprobante de ingresos. Puedes hacerlo en cualquiera de nuestras sucursales o iniciar el proceso en línea desde nuestra página web. El proceso toma aproximadamente 30 minutos.";
    }
    if (lowerQuestion.includes('tasa') && lowerQuestion.includes('interés')) {
      return "Las tasas de interés varían según el tipo de crédito: Crédito Personal (8.5% anual), Crédito Hipotecario (6.2% anual), Crédito Vehicular (7.8% anual), y Microcrédito (12% anual). Estas tasas están sujetas a cambios según las condiciones del mercado.";
    }
    if (lowerQuestion.includes('transferencia') && lowerQuestion.includes('límite')) {
      return "El límite de transferencia diaria es de Bs. 20.000 por cliente. Para montos mayores, necesitas autorización especial y puede tomar hasta 24 horas. Las transferencias entre cuentas del mismo banco son instantáneas, mientras que las interbancarias pueden tomar hasta 2 días hábiles.";
    }
    // Buscar en respuestas inteligentes por keywords
    for (const response of responsesData.intelligent_responses) {
      for (const keyword of response.keywords) {
        if (lowerQuestion.includes(keyword)) {
          return response.response;
        }
      }
    }
    // Respuesta por defecto
    const randomFallback = responsesData.fallback[Math.floor(Math.random() * responsesData.fallback.length)];
    return randomFallback;
  }, [responsesData]);
} 