import React from 'react'
import { BookOpen } from 'lucide-react'

function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      padding: '20px 24px',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '12px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <BookOpen size={32} />
        </div>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            margin: 0,
          }}>
            Wiki Quiz
          </h1>
          <p style={{
            fontSize: '14px',
            opacity: 0.8,
            margin: 0,
            marginTop: '2px',
          }}>
            AI-Powered Quiz Generator
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header