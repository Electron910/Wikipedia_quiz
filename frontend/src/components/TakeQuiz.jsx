import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Trophy, RotateCcw, Target, AlertCircle, XCircle } from 'lucide-react'
import QuizCard from './QuizCard'

function TakeQuiz({ questions, title, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const handleSelectOption = (option) => {
    if (!isSubmitted) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: option
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const handleRetry = () => {
    setAnswers({})
    setIsSubmitted(false)
    setShowReview(false)
    setCurrentQuestion(0)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correct++
      }
    })
    return correct
  }

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return '#28a745'
    if (percentage >= 60) return '#ffc107'
    return '#dc3545'
  }

  const score = calculateScore()
  const percentage = Math.round((score / questions.length) * 100)
  const answeredCount = Object.keys(answers).length

  // Results Screen
  if (isSubmitted && !showReview) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: `linear-gradient(135deg, ${getScoreColor(score, questions.length)}, ${getScoreColor(score, questions.length)}dd)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: `0 8px 24px ${getScoreColor(score, questions.length)}44`
          }}>
            <Trophy size={48} color="white" />
          </div>
          
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px'
          }}>
            Quiz Completed!
          </h2>
          <p style={{
            color: '#6c757d',
            fontSize: '16px',
            marginBottom: '36px'
          }}>
            {title}
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginBottom: '36px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '700',
                color: getScoreColor(score, questions.length),
                lineHeight: '1'
              }}>
                {score}/{questions.length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6c757d',
                marginTop: '8px',
                fontWeight: '500'
              }}>
                Correct Answers
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '700',
                color: getScoreColor(score, questions.length),
                lineHeight: '1'
              }}>
                {percentage}%
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6c757d',
                marginTop: '8px',
                fontWeight: '500'
              }}>
                Score
              </div>
            </div>
          </div>

          {/* Score Message */}
          <div style={{
            padding: '16px 24px',
            background: percentage >= 80 ? '#d4edda' : percentage >= 60 ? '#fff3cd' : '#f8d7da',
            borderRadius: '12px',
            marginBottom: '32px',
            color: percentage >= 80 ? '#155724' : percentage >= 60 ? '#856404' : '#721c24',
            fontWeight: '500'
          }}>
            {percentage >= 80 ? '🎉 Excellent work! You really know this topic!' :
             percentage >= 60 ? '👍 Good job! Keep learning!' :
             '📚 Keep studying! You can do better!'}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button 
              style={{
                padding: '14px 28px',
                background: '#f0f2f5',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setShowReview(true)}
            >
              <Target size={18} />
              Review Answers
            </button>
            <button 
              style={{
                padding: '14px 28px',
                background: '#3498db',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={handleRetry}
            >
              <RotateCcw size={18} />
              Try Again
            </button>
            <button 
              style={{
                padding: '14px 28px',
                background: '#6c757d',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={onBack}
            >
              <ArrowLeft size={18} />
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Review Screen - Shows all answers with correct/incorrect indication
  if (showReview) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <button 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#f0f2f5',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#6c757d',
              marginBottom: '16px'
            }}
            onClick={() => setShowReview(false)}
          >
            <ArrowLeft size={18} />
            Back to Results
          </button>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50',
            margin: 0,
            marginBottom: '8px'
          }}>
            Review: {title}
          </h1>
          <p style={{
            color: '#6c757d',
            fontSize: '14px',
            margin: 0
          }}>
            Your score: <strong style={{ color: getScoreColor(score, questions.length) }}>{score}/{questions.length} ({percentage}%)</strong>
          </p>
        </div>

        {/* Review Cards */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {questions.map((question, idx) => {
            const isCorrect = answers[idx] === question.answer
            return (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Result Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '16px',
                  zIndex: 1,
                  background: isCorrect ? '#28a745' : '#dc3545',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </div>
                
                <QuizCard
                  question={question}
                  index={idx}
                  showAnswer={true}
                  interactive={false}
                  selectedOption={answers[idx]}
                  isSubmitted={true}
                />
              </div>
            )
          })}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '32px',
          flexWrap: 'wrap'
        }}>
          <button 
            style={{
              padding: '14px 28px',
              background: '#3498db',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={handleRetry}
          >
            <RotateCcw size={18} />
            Try Again
          </button>
          <button 
            style={{
              padding: '14px 28px',
              background: '#6c757d',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={onBack}
          >
            <ArrowLeft size={18} />
            Back to Overview
          </button>
        </div>
      </div>
    )
  }

  // Quiz Taking Screen
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const hasSelectedCurrent = answers[currentQuestion] !== undefined

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <button 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#f0f2f5',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: '#6c757d',
            marginBottom: '16px'
          }}
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Exit Quiz
        </button>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#2c3e50',
          margin: 0,
          marginBottom: '8px'
        }}>
          {title}
        </h1>
        <p style={{
          color: '#6c757d',
          fontSize: '14px',
          margin: 0
        }}>
          Select an answer for each question, then submit to see your score
        </p>
        
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '20px'
        }}>
          <div style={{
            flex: 1,
            height: '10px',
            background: '#e9ecef',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3498db, #2980b9)',
              borderRadius: '5px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6c757d',
            minWidth: '80px',
            textAlign: 'right'
          }}>
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Hint Message */}
      {!hasSelectedCurrent && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          color: '#856404'
        }}>
          <AlertCircle size={20} />
          <span>Click on an option to select your answer</span>
        </div>
      )}

      {/* Question Card */}
      <div style={{ marginBottom: '24px' }}>
        <QuizCard
          question={question}
          index={currentQuestion}
          showAnswer={false}
          interactive={true}
          selectedOption={answers[currentQuestion]}
          onSelect={handleSelectOption}
          isSubmitted={false}
        />
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            background: '#f0f2f5',
            color: '#6c757d',
            opacity: currentQuestion === 0 ? 0.5 : 1
          }}
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft size={18} />
          Previous
        </button>
        
        <span style={{
          color: '#6c757d',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {answeredCount} of {questions.length} answered
        </span>

        {currentQuestion === questions.length - 1 ? (
          <button
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: answeredCount !== questions.length ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              background: '#28a745',
              color: 'white',
              opacity: answeredCount !== questions.length ? 0.5 : 1
            }}
            onClick={handleSubmit}
            disabled={answeredCount !== questions.length}
          >
            <CheckCircle size={18} />
            Submit Quiz
          </button>
        ) : (
          <button
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              background: '#3498db',
              color: 'white'
            }}
            onClick={handleNext}
          >
            Next
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export default TakeQuiz