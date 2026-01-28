import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '40px 20px',
    zIndex: 1000,
    overflowY: 'auto',
    backdropFilter: 'blur(4px)'
  },
  modal: {
    background: '#f8f9fa',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: 'calc(100vh - 80px)',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'modalSlideIn 0.3s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    background: 'white',
    borderBottom: '1px solid #dee2e6',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  closeBtn: {
    background: '#f0f2f5',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: '#6c757d'
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 160px)'
  }
}

function Modal({ children, onClose, title = "Quiz Details" }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <style>
        {`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button
            style={styles.closeBtn}
            onClick={onClose}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e9ecef'
              e.currentTarget.style.color = '#2c3e50'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f0f2f5'
              e.currentTarget.style.color = '#6c757d'
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal