import requests
import json
import re
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List, Optional
from app.config import get_settings

settings = get_settings()


class LLMService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        self.model = self._find_working_model()
        self.executor = ThreadPoolExecutor(max_workers=3)
        print(f"Initialized LLM Service with model: {self.model}")

    def _find_working_model(self) -> str:
        models_to_try = [
            "gemini-2.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro",
            "gemini-1.5-flash-latest",
            "gemini-pro-latest",
            
        ]
        
        for model in models_to_try:
            try:
                url = f"{self.base_url}/models/{model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{"parts": [{"text": "Say hi"}]}],
                    "generationConfig": {"maxOutputTokens": 10}
                }
                response = requests.post(url, json=payload, timeout=10)
                if response.status_code == 200:
                    print(f"Found working Gemini model: {model}")
                    return model
            except Exception as e:
                print(f"Model {model} failed: {e}")
                continue
        
        print("Warning: No working model found, defaulting to gemini-1.5-flash")
        return "gemini-1.5-flash"

    def _clean_json_response(self, response: str) -> str:
        response = re.sub(r"```json\s*", "", response)
        response = re.sub(r"```\s*", "", response)
        response = re.sub(r"```", "", response)
        response = response.strip()
        
        start_idx = response.find('{')
        end_idx = response.rfind('}')
        if start_idx != -1 and end_idx != -1:
            response = response[start_idx:end_idx + 1]
        
        return response

    def _call_llm(self, prompt: str, max_tokens: int = 2048) -> str:
        try:
            url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": max_tokens,
                    "topP": 0.8,
                    "topK": 40
                },
                "safetySettings": [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
                ]
            }
            
            response = requests.post(url, json=payload, timeout=60)
            
            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    candidate = data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        return candidate["content"]["parts"][0]["text"]
                print(f"Unexpected response structure: {data}")
                return ""
            else:
                print(f"Gemini API Error: {response.status_code} - {response.text[:500]}")
                return ""
                
        except requests.Timeout:
            print("Gemini API request timed out")
            return ""
        except Exception as e:
            print(f"LLM Error: {e}")
            return ""

    def _get_difficulty_guidelines(self, difficulty: str) -> str:
        guidelines = {
            "easy": """
EASY DIFFICULTY GUIDELINES:
- Questions about basic facts, names, dates, and locations
- Direct answers that are explicitly stated in the text
- Simple "What", "Who", "Where", "When" questions
- No complex reasoning required
- Answer should be obvious from reading the text
- Example: "What is the name of...?", "Where was X born?", "In what year did X happen?"
""",
            "medium": """
MEDIUM DIFFICULTY GUIDELINES:
- Questions requiring understanding of relationships and connections
- May require combining information from different parts of the text
- "Why" and "How" questions about causes and effects
- Questions about significance or importance of events
- Requires some inference but answer is supported by text
- Example: "Why did X lead to Y?", "What was significant about...?", "How did X contribute to...?"
""",
            "hard": """
HARD DIFFICULTY GUIDELINES:
- Questions requiring deep analysis and critical thinking
- Must synthesize multiple pieces of information
- Questions about implications, comparisons, or evaluations
- May require understanding context beyond explicit statements
- Complex "Why" questions about motivations or consequences
- Example: "What can be inferred about...?", "How does X compare to Y in terms of...?", "What would likely have happened if...?"
""",
            "mixed": """
MIXED DIFFICULTY:
- Generate 2 easy questions (basic facts, direct answers)
- Generate 3 medium questions (relationships, some inference)
- Generate 1 hard question (analysis, synthesis)
"""
        }
        return guidelines.get(difficulty, guidelines["mixed"])

    def generate_quiz(self, title: str, content: str, sections: List[str], difficulty: str = "mixed", num_questions: int = 6) -> List[dict]:
        difficulty_guidelines = self._get_difficulty_guidelines(difficulty)
        
        if difficulty == "mixed":
            difficulty_instruction = "Generate questions with mixed difficulties: 2 easy, 3 medium, 1 hard."
        else:
            difficulty_instruction = f"Generate ALL {num_questions} questions at {difficulty.upper()} difficulty level."

        prompt = f"""You are a quiz generator. Create exactly {num_questions} multiple-choice quiz questions about "{title}".

{difficulty_guidelines}

{difficulty_instruction}

Article Content:
{content[:4000]}

STRICT RULES - FOLLOW EXACTLY:
1. Generate EXACTLY {num_questions} questions
2. Each question MUST have EXACTLY 4 options
3. The "answer" field MUST be copied EXACTLY from one of the options (word-for-word match)
4. All questions must be based ONLY on the provided content - do NOT make up facts
5. {"ALL questions must be " + difficulty.upper() + " difficulty level" if difficulty != "mixed" else "Mix difficulties: 2 easy, 3 medium, 1 hard"}
6. Wrong options should be plausible but clearly incorrect
7. Explanations should be 1-2 sentences referencing the article

OUTPUT FORMAT - Return ONLY this JSON structure, nothing else:
{{"questions":[
{{"question":"First question text?","options":["Option A","Option B","Option C","Option D"],"answer":"Option A","difficulty":"{difficulty if difficulty != 'mixed' else 'easy'}","explanation":"Explanation here."}},
{{"question":"Second question text?","options":["Option A","Option B","Option C","Option D"],"answer":"Option B","difficulty":"{difficulty if difficulty != 'mixed' else 'medium'}","explanation":"Explanation here."}}
]}}

Generate the quiz now. Return ONLY valid JSON:"""

        response = self._call_llm(prompt, max_tokens=3000)
        if not response:
            print("Empty response from LLM, using fallback quiz")
            return self._generate_fallback_quiz(title, difficulty, num_questions)
            
        cleaned = self._clean_json_response(response)
        
        try:
            data = json.loads(cleaned)
            questions = []
            
            if isinstance(data, dict) and "questions" in data:
                questions = data["questions"]
            elif isinstance(data, list):
                questions = data
            
            if questions:
                validated_questions = []
                for q in questions[:num_questions]:
                    if self._validate_question(q):
                        if difficulty != "mixed":
                            q["difficulty"] = difficulty
                        validated_questions.append(q)
                
                if validated_questions:
                    return validated_questions
                    
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response was: {cleaned[:500]}")
        
        return self._generate_fallback_quiz(title, difficulty, num_questions)

    def _validate_question(self, question: dict) -> bool:
        required_fields = ["question", "options", "answer", "difficulty", "explanation"]
        
        for field in required_fields:
            if field not in question:
                return False
        
        if not isinstance(question["options"], list) or len(question["options"]) != 4:
            return False
        
        if question["answer"] not in question["options"]:
            for opt in question["options"]:
                if opt.lower().strip() == question["answer"].lower().strip():
                    question["answer"] = opt
                    return True
            question["answer"] = question["options"][0]
        
        return True

    def _generate_fallback_quiz(self, title: str, difficulty: str, num_questions: int = 6) -> List[dict]:
        diff = difficulty if difficulty != "mixed" else "easy"
        fallback = [
            {
                "question": f"What is the main subject of this article?",
                "options": [title, "Unknown Topic", "Different Subject", "Not Mentioned"],
                "answer": title,
                "difficulty": diff,
                "explanation": "This is the primary topic discussed in the article."
            },
            {
                "question": f"Which topic does this article primarily focus on?",
                "options": ["Science", title, "History", "Geography"],
                "answer": title,
                "difficulty": diff,
                "explanation": "The article is centered around this main subject."
            },
            {
                "question": f"What would be the best title for this article?",
                "options": [f"Introduction to {title}", "Random Facts", "Unrelated Topic", "General Knowledge"],
                "answer": f"Introduction to {title}",
                "difficulty": diff,
                "explanation": "The article provides information about this topic."
            },
            {
                "question": f"This article provides information about which subject?",
                "options": ["Mathematics", "Literature", title, "Music"],
                "answer": title,
                "difficulty": diff,
                "explanation": "The content is focused on this particular subject."
            }
        ]
        return fallback[:num_questions]

    def extract_entities(self, content: str) -> dict:
        prompt = f"""Analyze this text and extract named entities into three categories.

Text to analyze:
{content[:2500]}

Extract:
1. People: Names of individuals mentioned (real people only)
2. Organizations: Companies, institutions, universities, groups
3. Locations: Countries, cities, places, geographical locations

Rules:
- Maximum 5 items per category
- Use empty arrays [] if no entities found in a category
- Only extract entities that are actually mentioned in the text

Return ONLY valid JSON in this exact format:
{{"people":["Name 1","Name 2"],"organizations":["Org 1","Org 2"],"locations":["Place 1","Place 2"]}}

JSON response:"""

        response = self._call_llm(prompt, max_tokens=500)
        if not response:
            return {"people": [], "organizations": [], "locations": []}
            
        cleaned = self._clean_json_response(response)
        
        try:
            data = json.loads(cleaned)
            return {
                "people": data.get("people", [])[:8],
                "organizations": data.get("organizations", [])[:8],
                "locations": data.get("locations", [])[:8]
            }
        except json.JSONDecodeError as e:
            print(f"Entity extraction JSON error: {e}")
            return {"people": [], "organizations": [], "locations": []}

    def get_related_topics(self, title: str, links: List[str]) -> List[str]:
        if not links:
            return []
            
        available_links = links[:25]
        
        prompt = f"""From these Wikipedia topics related to "{title}", select the 8 most interesting and relevant topics for someone who wants to learn more.

Available topics: {', '.join(available_links)}

Selection criteria:
- Choose topics directly related to "{title}"
- Prefer educational and substantive topics
- Avoid very generic or unrelated topics

Return ONLY valid JSON in this exact format:
{{"topics":["Topic 1","Topic 2","Topic 3","Topic 4","Topic 5","Topic 6","Topic 7","Topic 8"]}}

JSON response:"""

        response = self._call_llm(prompt, max_tokens=300)
        if not response:
            return available_links[:8]
            
        cleaned = self._clean_json_response(response)
        
        try:
            data = json.loads(cleaned)
            if isinstance(data, dict) and "topics" in data:
                return data["topics"][:8]
            elif isinstance(data, list):
                return data[:8]
        except json.JSONDecodeError as e:
            print(f"Related topics JSON error: {e}")
        
        return available_links[:8]

    async def generate_all_async(self, title: str, content: str, sections: List[str], links: List[str], difficulty: str = "mixed", num_questions: int = 6) -> dict:
        loop = asyncio.get_event_loop()
        
        quiz_task = loop.run_in_executor(
            self.executor, 
            self.generate_quiz, 
            title, content, sections, difficulty, num_questions
        )
        
        entities_task = loop.run_in_executor(
            self.executor,
            self.extract_entities,
            content
        )
        
        topics_task = loop.run_in_executor(
            self.executor,
            self.get_related_topics,
            title, links
        )
        
        quiz, entities, topics = await asyncio.gather(
            quiz_task, entities_task, topics_task
        )
        
        return {
            "quiz": quiz,
            "entities": entities,
            "topics": topics
        }