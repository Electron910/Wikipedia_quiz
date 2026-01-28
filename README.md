# 🎓 Wiki Quiz App

An AI-powered quiz generator that creates interactive quizzes from Wikipedia articles using Google's Gemini AI.

![Wiki Quiz App Banner](screenshots/banner.png)

## 🌐 Live Demo

- **Frontend**: [https://wikipedia-quiz-roan.vercel.app/](https://wikipedia-quiz-roan.vercel.app/)
- **Backend API**: [https://wiki-quiz-api.onrender.com](https://wiki-quiz-api-2p0u.onrender.com)
- **API Docs**: [https://wiki-quiz-api.onrender.com/docs](https://wiki-quiz-api-2p0u.onrender.com/docs)

---

## ✨ Features

### Core Features
- **URL Input**: Generate quizzes from any Wikipedia article URL
- **Difficulty Levels**: Choose from Easy, Medium, Hard, or Mixed
- **Customizable**: Select 4, 6, 8, or 10 questions per quiz
- **Interactive Quiz Mode**: Take quizzes with real-time scoring
- **Results & Review**: See detailed results with explanations
- **History**: Access all previously generated quizzes
- **Entity Extraction**: Automatically identifies people, organizations, and locations
- **Related Topics**: Suggests related Wikipedia articles

### Technical Features
- **Fast Generation**: Parallel API calls for quick quiz generation
- **Caching**: Prevents duplicate scraping of same URL + difficulty
- **Auto Migration**: Database schema updates automatically
- **Responsive Design**: Works on desktop and mobile devices

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | Python web framework |
| PostgreSQL | Database |
| SQLAlchemy | ORM |
| BeautifulSoup | Web scraping |
| Google Gemini | AI quiz generation |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Axios | HTTP client |
| Lucide React | Icons |

### Deployment
| Service | Purpose |
|---------|---------|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| Neon | PostgreSQL database |


## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Google Gemini API Key [Get it here](https://makersuite.google.com/app/apikey)

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/wiki-quiz-app.git
cd wiki-quiz-app
```

## 📦 Backend Setup

### Navigate to backend

```bash
cd backend
```

### Create virtual environment

```bash
python -m venv venv
```

Activate it:

**Linux / Mac**

```bash
source venv/bin/activate
```

**Windows**

```bash
venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Create PostgreSQL database

```sql
CREATE DATABASE wiki_quiz;
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/wiki_quiz
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run server

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at:
👉 **[http://localhost:8000](http://localhost:8000)**

---

## 🎨 Frontend Setup

### Navigate to frontend

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Run development server

```bash
npm run dev
```

Frontend will be available at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📡 API Endpoints

### Generate Quiz

```http
POST /api/quiz/generate
Content-Type: application/json
```

```json
{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing",
  "difficulty": "medium",
  "num_questions": 6
}
```

---

### Get Quiz History

```http
GET /api/quiz/history
```

---

### Get Quiz by ID

```http
GET /api/quiz/{quiz_id}
```

---

### Validate URL

```http
POST /api/quiz/validate
Content-Type: application/json
```

```json
{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing"
}
```

---

## 📄 Sample API Response

```json
{
  "id": 1,
  "url": "https://en.wikipedia.org/wiki/Alan_Turing",
  "title": "Alan Turing",
  "summary": "Alan Mathison Turing was an English mathematician...",
  "key_entities": {
    "people": ["Alan Turing", "Alonzo Church"],
    "organizations": ["University of Cambridge", "Bletchley Park"],
    "locations": ["United Kingdom", "London"]
  },
  "sections": ["Early life", "Career", "Legacy"],
  "quiz": [
    {
      "question": "Where did Alan Turing study?",
      "options": ["Harvard", "Cambridge", "Oxford", "Princeton"],
      "answer": "Cambridge",
      "difficulty": "easy",
      "explanation": "Turing studied at King's College, Cambridge."
    }
  ],
  "related_topics": ["Cryptography", "Computer Science", "Enigma machine"],
  "difficulty": "medium",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## 🎨 LangChain Prompt Templates

### Quiz Generation Prompt

```
Create {num_questions} quiz questions about "{title}".

{difficulty_guidelines}

Content: {content}

Rules:
1. Generate exactly {num_questions} questions
2. Each question must have exactly 4 options
3. Answer must match one option exactly
4. Base questions only on provided content
5. Include brief explanations

Return valid JSON format only.
```

---

### Entity Extraction Prompt

```
Extract named entities from this text:
- People: Names of individuals
- Organizations: Companies, institutions
- Locations: Countries, cities, places

Return JSON with arrays for each category.
```

---

### Related Topics Prompt

```
From these Wikipedia topics related to "{title}",
select 8 most interesting for further reading.

Available: {links}

Return JSON array of topics.
```

---

## 🧪 Testing

### Test URLs

```
https://en.wikipedia.org/wiki/Alan_Turing
https://en.wikipedia.org/wiki/Albert_Einstein
https://en.wikipedia.org/wiki/World_War_II
https://en.wikipedia.org/wiki/Python_(programming_language)
https://en.wikipedia.org/wiki/Artificial_intelligence
https://en.wikipedia.org/wiki/Avatar_(2009_film)
```

### Sample Data

Check the `sample_data/` folder for example outputs.

---

## 📁 Project Structure

```
wiki-quiz-app/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── services/
│   │   │   ├── scraper.py
│   │   │   ├── llm_service.py
│   │   │   └── quiz_service.py
│   │   └── routers/
│   │       └── quiz.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── sample_data/
├── screenshots/
└── README.md
```

---

## 🚢 Deployment

### Backend (Render)

1. Connect GitHub repository
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

---

### Frontend (Vercel)

1. Connect GitHub repository
2. Set root directory to `frontend`
3. Add `VITE_API_URL` environment variable
4. Deploy

---

### Database (Neon)

1. Create free PostgreSQL database
2. Copy connection string
3. Paste into backend `.env`

---

## 🔒 Environment Variables

### Backend

| Variable       | Description                  |
| -------------- | ---------------------------- |
| DATABASE_URL   | PostgreSQL connection string |
| GEMINI_API_KEY | Google Gemini API key        |
| FRONTEND_URL   | Frontend URL for CORS        |

### Frontend

| Variable     | Description     |
| ------------ | --------------- |
| VITE_API_URL | Backend API URL |
