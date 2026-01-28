import React from 'react'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'

const getDifficultyStyle = (difficulty) => {
  const colors = {
    easy: { background: '#e6f7ed', color: '#166534' },
    medium: { background: '#fff3cd', color: '#856404' },
    hard: { background: '#fdf2f2', color: '#991b1b' }
  }
  return colors[difficulty] || colors.easy
}

function QuizCard({ 
  question, 
  index, 
  showAnswer = false,
  interactive = false,
  onSelect, 
  selectedOption, 
  isSubmitted = false 
}) {
  const difficultyStyle = getDifficultyStyle(question.difficulty)

  const getOptionStyle = (option) => {
    let backgroundColor = '#ffffff'
    let borderColor = '#e0e0e0'
    let textColor = '#333333'

    if (isSubmitted) {
      if (option === question.answer) {
        backgroundColor = '#d4edda'
        borderColor = '#28a745'
      } else if (option === selectedOption && option !== question.answer) {
        backgroundColor = '#f8d7da'
        borderColor = '#dc3545'
      }
    } else if (selectedOption === option) {
      backgroundColor = '#e3f2fd'
      borderColor = '#2196f3'
    }

    return {
      padding: '16px 20px',
      borderRadius: '12px',
      border: `2px solid ${borderColor}`,
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease',
      cursor: interactive && !isSubmitted ? 'pointer' : 'default',
      backgroundColor: backgroundColor,
      color: textColor,
      marginBottom: '0'
    }
  }

  const getOptionLabelStyle = (option) => {
    let backgroundColor = '#f5f5f5'
    let color = '#666666'

    if (isSubmitted) {
      if (option === question.answer) {
        backgroundColor = '#28a745'
        color = '#ffffff'
      } else if (option === selectedOption && option !== question.answer) {
        backgroundColor = '#dc3545'
        color = '#ffffff'
      }
    } else if (selectedOption === option) {
      backgroundColor = '#2196f3'
      color = '#ffffff'
    }

    return {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: backgroundColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: color,
      flexShrink: 0
    }
  }

  const handleOptionClick = (option) => {
    if (interactive && !isSubmitted && onSelect) {
      onSelect(option)
    }
  }

  const handleMouseEnter = (e, option) => {
    if (interactive && !isSubmitted && selectedOption !== option) {
      e.currentTarget.style.borderColor = '#2196f3'
      e.currentTarget.style.backgroundColor = '#f8f9fa'
    }
  }

  const handleMouseLeave = (e, option) => {
    if (interactive && !isSubmitted && selectedOption !== option) {
      e.currentTarget.style.borderColor = '#e0e0e0'
      e.currentTarget.style.backgroundColor = '#ffffff'
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#6c757d',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Question {index + 1}
        </span>
        <span style={{
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'capitalize',
          ...difficultyStyle
        }}>
          {question.difficulty}
        </span>
      </div>
      
      {/* Question */}
      <p style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: '24px',
        lineHeight: '1.6'
      }}>
        {question.question}
      </p>
      
      {/* Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {question.options.map((option, idx) => (
          <div
            key={idx}
            style={getOptionStyle(option)}
            onClick={() => handleOptionClick(option)}
            onMouseEnter={(e) => handleMouseEnter(e, option)}
            onMouseLeave={(e) => handleMouseLeave(e, option)}
          >
            <span style={getOptionLabelStyle(option)}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span style={{ flex: 1, fontWeight: '500' }}>{option}</span>
            {isSubmitted && option === question.answer && (
              <CheckCircle size={22} color="#28a745" />
            )}
            {isSubmitted && option === selectedOption && option !== question.answer && (
              <XCircle size={22} color="#dc3545" />
            )}
          </div>
        ))}
      </div>
      
      {/* Answer Section - Only show when showAnswer is true */}
      {showAnswer && (
        <>
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
            borderRadius: '12px',
            marginTop: '20px',
            borderLeft: '4px solid #28a745'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#155724',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle size={14} />
              Correct Answer
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#155724'
            }}>
              {question.answer}
            </div>
          </div>
          
          {question.explanation && (
            <div style={{
              marginTop: '12px',
              padding: '14px 16px',
              background: '#f8f9fa',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#6c757d',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              lineHeight: '1.5'
            }}>
              <HelpCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#6c757d' }} />
              <span>{question.explanation}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default QuizCard