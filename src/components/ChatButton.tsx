import React, { useState } from 'react';

export function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante */}
      <button
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 1000,
          background: '#2563eb',
          color: '#fff',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          fontSize: '24px',
          cursor: 'pointer'
        }}
        onClick={() => setOpen(true)}
        title="Abrir chat"
      >
        💬
      </button>

      {/* Modal do chat */}
      {open && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.0)', // fundo transparente
            zIndex: 2000,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 400,
              height: 600,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              zIndex: 2100,
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'transparent',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Fechar"
            >×</button>
            <iframe
              src="/chat.html"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Chat SXS"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}