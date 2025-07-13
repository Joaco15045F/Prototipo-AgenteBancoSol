import React from 'react';

export default function MessageBubble({ content, role }) {
  // Si el contenido es string, mostrar normal
  if (typeof content === 'string') {
    return <div className={`bubble ${role === 'user' ? 'user' : 'bot'}`}>{content}</div>;
  }
  // Si es objeto enriquecido
  return (
    <div className={`bubble ${role === 'user' ? 'user' : 'bot'}`}>
      {content.text && <span>{content.text}</span>}
      {content.image && <img src={content.image} alt="Imagen relacionada" style={{ maxWidth: '100%', marginTop: 8, borderRadius: 8 }} />}
      {content.link && <a href={content.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8, color: '#83007b', fontWeight: 600 }}>{content.linkLabel || 'Ver más'}</a>}
      {content.actions && Array.isArray(content.actions) && (
        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          {content.actions.map((action, idx) => (
            <button key={idx} onClick={action.onClick} style={{ padding: '0.5rem 1.2rem', borderRadius: 16, border: 'none', background: '#ffd600', color: '#32006e', fontWeight: 700, cursor: 'pointer' }}>{action.label}</button>
          ))}
        </div>
      )}
    </div>
  );
} 