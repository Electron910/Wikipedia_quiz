import React, { useState, useEffect } from 'react'
import { BookOpen, History, Sparkles, Zap, Brain, Rocket, Shuffle, CheckCircle } from 'lucide-react'
import Header from './components/Header'
import QuizDisplay from './components/QuizDisplay'
import HistoryTable from './components/HistoryTable'
import Modal from './components/Modal'
import LoadingSpinner from './components/LoadingSpinner'
import { generateQuiz, getQuizHistory, getQuizById, validateUrl } from './services/api'

const difficultyOptions = [
  { 
    value: 'easy', 
    label: 'Easy', 
    icon: Zap, 
    color: '#22c55e',
    bgColor: '#dcfce7',
    borderColor: '#86efac',
    description: 'Basic facts and direct answers'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    icon: Brain, 
    color: '#f59e0b',
    bgColor: '#fef3c7',
    borderColor: '#fcd34d',
    description: 'Requires understanding relationships'
  },
  { 
    value: 'hard', 
    label: 'Hard', 
    icon: Rocket, 
    color: '#ef4444',
    bgColor: '#fee2e2',
    borderColor: '#fca5a5',
    description: 'Deep analysis and critical thinking'
  },
  { 
    value: 'mixed', 
    label: 'Mixed', 
    icon: Shuffle, 
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    borderColor: '#c4b5fd',
    description: 'Combination of all difficulty levels'
  }
]

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
  },
  mainContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '24px 20px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '24px',
    background: 'white',
    borderRadius: '16px',
    padding: '6px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  tabBtn: {
    flex: 1,
    padding: '14px 24px',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  tabBtnActive: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  },
  inputSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  sectionDesc: {
    color: '#64748b',
    fontSize: '15px',
    marginBottom: '24px',
  },
  urlInput: {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  urlPreview: {
    marginTop: '12px',
    padding: '12px 16px',
    background: '#dcfce7',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#166534',
  },
  difficultySection: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  },
  difficultyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '28px',
  },
  difficultyCard: {
    position: 'relative',
    padding: '20px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '2px solid #e2e8f0',
    background: 'white',
  },
  difficultyIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  difficultyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  difficultyLabel: {
    fontSize: '17px',
    fontWeight: '700',
  },
  difficultyDesc: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.4',
  },
  selectedCheck: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  questionsSection: {
    marginBottom: '28px',
  },
  questionsLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    display: 'block',
  },
  countButtons: {
    display: 'flex',
    gap: '10px',
  },
  countBtn: {
    width: '56px',
    height: '48px',
    border: '2px solid #e2e8f0',
    background: 'white',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  countBtnActive: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderColor: '#3b82f6',
    color: 'white',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  generateBtn: {
    width: '100%',
    padding: '18px 32px',
    border: 'none',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
  },
  errorMessage: {
    marginTop: '20px',
    padding: '16px 20px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    color: '#dc2626',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  loadingText: {
    marginTop: '24px',
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
  },
  loadingSubtext: {
    color: '#64748b',
    fontSize: '14px',
    marginTop: '8px',
  },
  loadingBadge: {
    marginTop: '20px',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
  },
}

function App() {
  const [activeTab, setActiveTab] = useState('generate')
  const [url, setUrl] = useState('')
  const [difficulty, setDifficulty] = useState('mixed')
  const [numQuestions, setNumQuestions] = useState(6)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')
  const [quizData, setQuizData] = useState(null)
  const [history, setHistory] = useState([])
  const [modalData, setModalData] = useState(null)
  const [urlPreview, setUrlPreview] = useState(null)

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory()
    }
  }, [activeTab])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url && url.includes('wikipedia.org')) {
        handleUrlValidation()
      } else {
        setUrlPreview(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [url])

  const handleUrlValidation = async () => {
    try {
      const result = await validateUrl(url)
      setUrlPreview(result)
    } catch (err) {
      setUrlPreview(null)
    }
  }

  const fetchHistory = async () => {
    try {
      const data = await getQuizHistory()
      setHistory(data)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL')
      return
    }

    setLoading(true)
    setError('')
    setQuizData(null)

    const messages = [
      'Fetching Wikipedia article...',
      'Analyzing content...',
      `Generating ${difficulty} questions...`,
      'Creating quiz options...',
      'Almost done...'
    ]

    let messageIndex = 0
    setLoadingMessage(messages[0])

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length
      setLoadingMessage(messages[messageIndex])
    }, 3000)

    try {
      const data = await generateQuiz(url, difficulty, numQuestions)
      setQuizData(data)
      fetchHistory()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz. Please try again.')
    } finally {
      clearInterval(messageInterval)
      setLoading(false)
      setLoadingMessage('')
    }
  }

  const handleViewDetails = async (id) => {
    try {
      const data = await getQuizById(id)
      setModalData(data)
    } catch (err) {
      console.error('Failed to fetch quiz details:', err)
    }
  }

  const selectedDifficulty = difficultyOptions.find(d => d.value === difficulty)

  return (
    <div style={styles.app}>
      <Header />
      <main style={styles.mainContainer}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'generate' ? styles.tabBtnActive : {})
            }}
            onClick={() => setActiveTab('generate')}
          >
            <Sparkles size={18} />
            Generate Quiz
          </button>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'history' ? styles.tabBtnActive : {})
            }}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} />
            Past Quizzes
          </button>
        </div>

        {activeTab === 'generate' && (
          <div>
            {/* URL Input Section */}
            <div style={styles.inputSection}>
              <h2 style={styles.sectionTitle}>Create a Quiz from Wikipedia</h2>
              <p style={styles.sectionDesc}>Enter a Wikipedia article URL to automatically generate an interactive quiz</p>
              <input
                type="text"
                style={{
                  ...styles.urlInput,
                  borderColor: url ? '#3b82f6' : '#e2e8f0',
                }}
                placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleGenerate()}
                disabled={loading}
              />
              {urlPreview && urlPreview.valid && !loading && (
                <div style={styles.urlPreview}>
                  <CheckCircle size={18} color="#22c55e" />
                  <span>Article found: <strong>{urlPreview.title}</strong></span>
                </div>
              )}
            </div>

            {/* Difficulty Selection */}
            <div style={styles.difficultySection}>
              <h3 style={styles.sectionTitle}>Select Difficulty Level</h3>
              <p style={styles.sectionDesc}>Choose the difficulty level for your quiz questions</p>
              
              <div style={styles.difficultyGrid}>
                {difficultyOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = difficulty === option.value
                  return (
                    <div
                      key={option.value}
                      style={{
                        ...styles.difficultyCard,
                        borderColor: isSelected ? option.color : '#e2e8f0',
                        backgroundColor: isSelected ? option.bgColor : 'white',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected ? `0 8px 25px ${option.color}30` : 'none',
                      }}
                      onClick={() => !loading && setDifficulty(option.value)}
                    >
                      <div 
                        style={{
                          ...styles.difficultyIcon,
                          backgroundColor: isSelected ? option.color : option.bgColor,
                        }}
                      >
                        <Icon size={28} color={isSelected ? 'white' : option.color} />
                      </div>
                      <div style={styles.difficultyInfo}>
                        <span style={{
                          ...styles.difficultyLabel,
                          color: isSelected ? option.color : '#1e293b',
                        }}>
                          {option.label}
                        </span>
                        <span style={styles.difficultyDesc}>
                          {option.description}
                        </span>
                      </div>
                      {isSelected && (
                        <div style={{
                          ...styles.selectedCheck,
                          backgroundColor: option.color,
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Number of Questions */}
              <div style={styles.questionsSection}>
                <label style={styles.questionsLabel}>Number of Questions</label>
                <div style={styles.countButtons}>
                  {[4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      style={{
                        ...styles.countBtn,
                        ...(numQuestions === num ? styles.countBtnActive : {})
                      }}
                      onClick={() => !loading && setNumQuestions(num)}
                      disabled={loading}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                style={{
                  ...styles.generateBtn,
                  background: loading 
                    ? '#94a3b8' 
                    : `linear-gradient(135deg, ${selectedDifficulty.color} 0%, ${selectedDifficulty.color}dd 100%)`,
                  cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !url.trim() ? 0.7 : 1,
                }}
                onClick={handleGenerate}
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size={22} />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <BookOpen size={22} />
                    Generate {selectedDifficulty.label} Quiz
                  </>
                )}
              </button>

              {error && (
                <div style={styles.errorMessage}>
                  <span>⚠️</span>
                  {error}
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div style={styles.loadingContainer}>
                <LoadingSpinner size={56} />
                <p style={styles.loadingText}>{loadingMessage}</p>
                <span style={styles.loadingSubtext}>This usually takes 15-30 seconds</span>
                <div style={{
                  ...styles.loadingBadge,
                  backgroundColor: selectedDifficulty.bgColor,
                  color: selectedDifficulty.color,
                }}>
                  {selectedDifficulty.icon && <selectedDifficulty.icon size={16} style={{ marginRight: '6px', display: 'inline' }} />}
                  Generating {selectedDifficulty.label} Questions
                </div>
              </div>
            )}

            {/* Quiz Result */}
            {quizData && !loading && (
              <QuizDisplay data={quizData} />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryTable 
            history={history} 
            onViewDetails={handleViewDetails}
            onRefresh={fetchHistory}
          />
        )}

        {modalData && (
          <Modal onClose={() => setModalData(null)}>
            <QuizDisplay data={modalData} />
          </Modal>
        )}
      </main>
    </div>
  )
}

export default App