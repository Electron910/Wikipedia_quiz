import React from 'react'
import { Eye, RefreshCw, Clock, ExternalLink, Database, Zap, Brain, Rocket, Shuffle } from 'lucide-react'

const getDifficultyIcon = (difficulty) => {
  const icons = {
    easy: { icon: Zap, color: '#28a745', bg: '#d4edda' },
    medium: { icon: Brain, color: '#ffc107', bg: '#fff3cd' },
    hard: { icon: Rocket, color: '#dc3545', bg: '#f8d7da' },
    mixed: { icon: Shuffle, color: '#6f42c1', bg: '#e2d9f3' }
  }
  return icons[difficulty] || icons.mixed
}

function HistoryTable({ history, onViewDetails, onRefresh }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: 0
        }}>
          <Database size={20} />
          Quiz History
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#6c757d',
            background: '#f0f2f5',
            padding: '2px 10px',
            borderRadius: '12px'
          }}>
            {history.length} quizzes
          </span>
        </h2>
        <button 
          style={{
            padding: '8px 16px',
            background: '#f0f2f5',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6c757d'
          }}
          onClick={onRefresh}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <Database size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
            No quizzes yet
          </h3>
          <p style={{ fontSize: '14px', margin: 0 }}>
            Generate your first quiz from the "Generate Quiz" tab
          </p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '14px 20px',
                background: '#f8f9fa',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>ID</th>
              <th style={{
                textAlign: 'left',
                padding: '14px 20px',
                background: '#f8f9fa',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>Article</th>
              <th style={{
                textAlign: 'left',
                padding: '14px 20px',
                background: '#f8f9fa',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>Difficulty</th>
              <th style={{
                textAlign: 'left',
                padding: '14px 20px',
                background: '#f8f9fa',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>Created</th>
              <th style={{
                textAlign: 'right',
                padding: '14px 20px',
                background: '#f8f9fa',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => {
              const difficultyStyle = getDifficultyIcon(item.difficulty)
              const DiffIcon = difficultyStyle.icon
              return (
                <tr key={item.id}>
                  <td style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f2f5',
                    fontSize: '14px'
                  }}>
                    <span style={{
                      background: '#f0f2f5',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d'
                    }}>
                      #{item.id}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f2f5',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '12px',
                        color: '#3498db',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={12} />
                      {truncateUrl(item.url)}
                    </a>
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f2f5',
                    fontSize: '14px'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: difficultyStyle.bg,
                      color: difficultyStyle.color,
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      <DiffIcon size={14} />
                      {item.difficulty || 'mixed'}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f2f5',
                    fontSize: '14px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#6c757d',
                      fontSize: '13px'
                    }}>
                      <Clock size={14} />
                      {formatDate(item.created_at)}
                    </div>
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f2f5',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}>
                    <button
                      style={{
                        padding: '8px 16px',
                        background: '#2c3e50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onClick={() => onViewDetails(item.id)}
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default HistoryTable