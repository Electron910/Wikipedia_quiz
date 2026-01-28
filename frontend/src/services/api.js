import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

console.log('API Base URL:', API_BASE)

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000
})

export const generateQuiz = async (url, difficulty = 'mixed', numQuestions = 6) => {
  const response = await api.post('/api/quiz/generate', { 
    url,
    difficulty,
    num_questions: numQuestions
  })
  return response.data
}

export const getQuizHistory = async () => {
  const response = await api.get('/api/quiz/history')
  return response.data
}

export const getQuizById = async (id) => {
  const response = await api.get(`/api/quiz/${id}`)
  return response.data
}

export const validateUrl = async (url) => {
  const response = await api.post('/api/quiz/validate', { url })
  return response.data
}