import React, { useState } from 'react'
import { Users, Building, MapPin, List, Lightbulb, BookOpen, Play, Eye, EyeOff } from 'lucide-react'
import QuizCard from './QuizCard'
import TakeQuiz from './TakeQuiz'

function QuizDisplay({ data }) {
  const [takeQuizMode, setTakeQuizMode] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)

  if (takeQuizMode) {
    return (
      <TakeQuiz 
        questions={data.quiz} 
        title={data.title}
        onBack={() => setTakeQuizMode(false)} 
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#2c3e50',
          margin: 0,
          marginBottom: '8px'
        }}>
          {data.title}
        </h1>
        {/* Add this right after the <h1> title tag */}
{data.difficulty && (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: data.difficulty === 'easy' ? '#d4edda' : 
               data.difficulty === 'medium' ? '#fff3cd' : 
               data.difficulty === 'hard' ? '#f8d7da' : '#e2d9f3',
    color: data.difficulty === 'easy' ? '#155724' : 
           data.difficulty === 'medium' ? '#856404' : 
           data.difficulty === 'hard' ? '#721c24' : '#6f42c1',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize',
    marginLeft: '12px'
  }}>
    {data.difficulty} Difficulty
  </span>
)}
        <a 
          href={data.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            color: '#3498db',
            fontSize: '13px',
            wordBreak: 'break-all',
            marginBottom: '16px',
            display: 'block',
            textDecoration: 'none'
          }}
        >
          {data.url}
        </a>
        <p style={{
          color: '#6c757d',
          fontSize: '15px',
          lineHeight: '1.7',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '12px',
          borderLeft: '4px solid #3498db',
          margin: 0
        }}>
          {data.summary}
        </p>
      </div>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Key Entities */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6c757d',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            marginBottom: '16px'
          }}>
            <Users size={18} />
            Key Entities
          </h3>
          
          {data.key_entities?.people?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Users size={14} /> People
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {data.key_entities.people.map((person, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: '#e8f4f8',
                    color: '#2c3e50'
                  }}>
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {data.key_entities?.organizations?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Building size={14} /> Organizations
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {data.key_entities.organizations.map((org, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: '#f0e6ff',
                    color: '#6b21a8'
                  }}>
                    {org}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {data.key_entities?.locations?.length > 0 && (
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <MapPin size={14} /> Locations
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {data.key_entities.locations.map((loc, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: '#fef3c7',
                    color: '#92400e'
                  }}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(!data.key_entities?.people?.length && 
            !data.key_entities?.organizations?.length && 
            !data.key_entities?.locations?.length) && (
            <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>No entities extracted</p>
          )}
        </div>

        {/* Article Sections */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6c757d',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            marginBottom: '16px'
          }}>
            <List size={18} />
            Article Sections
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.sections?.length > 0 ? (
              data.sections.map((section, idx) => (
                <span key={idx} style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  background: '#f0f2f5',
                  color: '#2c3e50'
                }}>
                  {section}
                </span>
              ))
            ) : (
              <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>No sections found</p>
            )}
          </div>
        </div>

        {/* Related Topics */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6c757d',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            marginBottom: '16px'
          }}>
            <Lightbulb size={18} />
            Related Topics
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.related_topics?.length > 0 ? (
              data.related_topics.map((topic, idx) => (
                <span key={idx} style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  background: '#e6f7ed',
                  color: '#166534'
                }}>
                  {topic}
                </span>
              ))
            ) : (
              <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>No related topics</p>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: 0
          }}>
            <BookOpen size={24} />
            Quiz Questions ({data.quiz?.length || 0})
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              style={{
                padding: '12px 24px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onClick={() => setTakeQuizMode(true)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#218838'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#28a745'}
            >
              <Play size={18} />
              Take Quiz
            </button>
            <button 
              style={{
                padding: '12px 24px',
                background: showAnswers ? '#6c757d' : '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? <EyeOff size={18} /> : <Eye size={18} />}
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
          </div>
        </div>

        {/* Info Message */}
        {!showAnswers && (
          <div style={{
            background: '#e7f3ff',
            border: '1px solid #b6d4fe',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            color: '#084298'
          }}>
            <Eye size={20} />
            <span>
              <strong>Answers are hidden.</strong> Click "Take Quiz" for an interactive experience, or "Show Answers" to reveal all answers.
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gap: '20px' }}>
          {data.quiz?.map((question, idx) => (
            <QuizCard 
              key={idx} 
              question={question} 
              index={idx}
              showAnswer={showAnswers}
              interactive={false}
              isSubmitted={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizDisplay