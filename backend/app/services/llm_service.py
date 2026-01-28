import requests
import json
import re
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List
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
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro",
        ]
        
        for model in models_to_try:
            try:
                url = f"{self.base_url}/models/{model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{"parts": [{"text": "Say hello"}]}],
                    "generationConfig": {"maxOutputTokens": 10}
                }
                response = requests.post(url, json=payload, timeout=10)
                if response.status_code == 200:
                    print(f"Found working Gemini model: {model}")
                    return model
            except Exception as e:
                print(f"Model {model} failed: {e}")
                continue
        
        return "gemini-2.5-flash"

    def _call_llm(self, prompt: str, max_tokens: int = 4096) -> str:
        try:
            url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
            
            payload = {
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": max_tokens,
                    "topP": 0.9,
                    "topK": 40
                }
            }
            
            response = requests.post(url, json=payload, timeout=90)
            
            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    candidate = data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        text = candidate["content"]["parts"][0]["text"]
                        print(f"LLM Response length: {len(text)} chars")
                        return text
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

    def _extract_json_from_response(self, response: str) -> str:
        """Extract JSON from response, handling various formats"""
        if not response:
            return ""
        
        # Remove markdown code blocks
        response = re.sub(r'```json\s*', '', response)
        response = re.sub(r'```\s*', '', response)
        response = response.strip()
        
        # Try to find JSON object
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            return json_match.group()
        
        # Try to find JSON array
        array_match = re.search(r'\$\$[\s\S]*?\$\$', response)

        if array_match:
            return array_match.group()
        
        return response

    def generate_quiz(self, title: str, content: str, sections: List[str], difficulty: str = "mixed", num_questions: int = 6) -> List[dict]:
        """Generate quiz questions based on difficulty level"""
        
        print(f"\n{'='*50}")
        print(f"Generating {num_questions} {difficulty.upper()} questions for: {title}")
        print(f"{'='*50}")
        
        # Create difficulty-specific prompt
        prompt = self._create_quiz_prompt(title, content, difficulty, num_questions)
        
        # Call LLM
        response = self._call_llm(prompt, max_tokens=4096)
        
        if not response:
            print("ERROR: Empty response from LLM")
            return self._generate_fallback_quiz(title, difficulty, num_questions)
        
        # Parse response
        json_str = self._extract_json_from_response(response)
        print(f"Extracted JSON length: {len(json_str)} chars")
        
        try:
            data = json.loads(json_str)
            
            questions = []
            if isinstance(data, dict):
                if "questions" in data:
                    questions = data["questions"]
                elif "quiz" in data:
                    questions = data["quiz"]
                else:
                    # Maybe the dict itself contains question fields
                    questions = [data] if "question" in data else []
            elif isinstance(data, list):
                questions = data
            
            if questions:
                validated = self._validate_questions(questions, difficulty, num_questions)
                if validated:
                    print(f"SUCCESS: Generated {len(validated)} questions")
                    return validated
                else:
                    print("ERROR: No valid questions after validation")
            else:
                print("ERROR: No questions found in response")
                print(f"Response preview: {json_str[:500]}")
                
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response preview: {json_str[:500] if json_str else 'empty'}")
        
        # If we get here, try a simpler prompt
        print("Retrying with simplified prompt...")
        return self._generate_with_simple_prompt(title, content, difficulty, num_questions)

    def _create_quiz_prompt(self, title: str, content: str, difficulty: str, num_questions: int) -> str:
        """Create a prompt based on difficulty level"""
        
        difficulty_desc = {
            "easy": "EASY - Basic factual questions with obvious answers directly stated in the text. Use simple 'What', 'Who', 'Where', 'When' questions.",
            "medium": "MEDIUM - Questions requiring understanding of relationships and connections. Some inference needed but answers supported by text.",
            "hard": "HARD - Complex analytical questions requiring synthesis of multiple facts. Deep understanding and critical thinking needed.",
            "mixed": "MIXED - Include 2 easy, 2 medium, and 2 hard questions."
        }
        
        diff_instruction = difficulty_desc.get(difficulty, difficulty_desc["mixed"])
        
        prompt = f"""You are a quiz generator. Create exactly {num_questions} multiple choice questions about "{title}".

DIFFICULTY LEVEL: {diff_instruction}

ARTICLE CONTENT:
{content[:5000]}

INSTRUCTIONS:
1. Create exactly {num_questions} questions
2. Each question has exactly 4 options labeled as simple text (not A, B, C, D)
3. One option must be the correct answer
4. Questions must be based only on the article content
5. All questions should be {difficulty.upper()} difficulty{"" if difficulty == "mixed" else " level"}

OUTPUT FORMAT - Return a JSON object exactly like this:
{{
  "questions": [
    {{
      "question": "What year was [subject] born?",
      "options": ["1900", "1912", "1920", "1930"],
      "answer": "1912",
      "difficulty": "{difficulty if difficulty != 'mixed' else 'easy'}",
      "explanation": "The article states [subject] was born in 1912."
    }},
    {{
      "question": "Where did [subject] work?",
      "options": ["Location A", "Location B", "Location C", "Location D"],
      "answer": "Location B",
      "difficulty": "{difficulty if difficulty != 'mixed' else 'medium'}",
      "explanation": "According to the article, [subject] worked at Location B."
    }}
  ]
}}

IMPORTANT:
- The "answer" field must EXACTLY match one of the options
- Generate exactly {num_questions} questions
- Return ONLY the JSON object, no other text
- All questions must be about "{title}" based on the provided content

Generate the quiz now:"""

        return prompt

    def _generate_with_simple_prompt(self, title: str, content: str, difficulty: str, num_questions: int) -> List[dict]:
        """Try with a simpler prompt if the main one fails"""
        
        simple_prompt = f"""Create {num_questions} {difficulty} quiz questions about "{title}".

Content: {content[:3000]}

Return JSON format:
{{"questions":[{{"question":"Q1?","options":["A","B","C","D"],"answer":"A","difficulty":"{difficulty}","explanation":"Why A is correct."}}]}}

Rules:
- {num_questions} questions total
- 4 options each
- answer must match an option exactly
- {difficulty} difficulty only
- JSON only, no other text"""

        response = self._call_llm(simple_prompt, max_tokens=3000)
        
        if not response:
            print("Simple prompt also failed")
            return self._generate_fallback_quiz(title, difficulty, num_questions)
        
        json_str = self._extract_json_from_response(response)
        
        try:
            data = json.loads(json_str)
            questions = data.get("questions", data) if isinstance(data, dict) else data
            
            if questions:
                validated = self._validate_questions(questions, difficulty, num_questions)
                if validated:
                    print(f"Simple prompt SUCCESS: {len(validated)} questions")
                    return validated
        except json.JSONDecodeError as e:
            print(f"Simple prompt JSON error: {e}")
        
        return self._generate_fallback_quiz(title, difficulty, num_questions)

    def _validate_questions(self, questions: List, difficulty: str, num_questions: int) -> List[dict]:
        """Validate and fix questions"""
        validated = []
        
        for q in questions:
            if not isinstance(q, dict):
                continue
                
            # Check required fields
            if "question" not in q or "options" not in q:
                continue
            
            # Ensure options is a list of 4 items
            if not isinstance(q["options"], list) or len(q["options"]) < 4:
                continue
            
            # Trim to 4 options
            q["options"] = q["options"][:4]
            
            # Fix answer field
            if "answer" not in q or q["answer"] not in q["options"]:
                # Try to find a matching option
                found = False
                if "answer" in q:
                    for opt in q["options"]:
                        if opt.lower().strip() == str(q["answer"]).lower().strip():
                            q["answer"] = opt
                            found = True
                            break
                if not found:
                    q["answer"] = q["options"][0]
            
            # Set difficulty
            if difficulty != "mixed":
                q["difficulty"] = difficulty
            elif "difficulty" not in q:
                q["difficulty"] = "medium"
            
            # Ensure explanation exists
            if "explanation" not in q or not q["explanation"]:
                q["explanation"] = f"This is the correct answer based on the article content."
            
            validated.append(q)
            
            if len(validated) >= num_questions:
                break
        
        return validated

    def _generate_fallback_quiz(self, title: str, difficulty: str, num_questions: int = 6) -> List[dict]:
        """Generate fallback questions when LLM fails"""
        print(f"WARNING: Using fallback quiz for {title}")
        
        diff = difficulty if difficulty != "mixed" else "medium"
        
        fallback_questions = [
            {
                "question": f"What is the main topic of this Wikipedia article?",
                "options": [title, "World History", "Science Fiction", "Ancient Civilizations"],
                "answer": title,
                "difficulty": diff,
                "explanation": f"The article is primarily about {title}."
            },
            {
                "question": f"Which subject does this article focus on?",
                "options": ["Mathematics", title, "Geography", "Literature"],
                "answer": title,
                "difficulty": diff,
                "explanation": f"This article provides information about {title}."
            },
            {
                "question": f"What would be an appropriate title for this article?",
                "options": [f"Introduction to {title}", "Random Topics", "Unrelated Subject", "General Knowledge"],
                "answer": f"Introduction to {title}",
                "difficulty": diff,
                "explanation": f"The article covers various aspects of {title}."
            },
            {
                "question": f"This article belongs to which category?",
                "options": ["Entertainment", "Sports", f"Related to {title}", "Cooking"],
                "answer": f"Related to {title}",
                "difficulty": diff,
                "explanation": f"The content is centered around {title}."
            },
            {
                "question": f"What type of information does this article provide?",
                "options": [f"Facts about {title}", "Fiction stories", "Recipes", "Weather forecasts"],
                "answer": f"Facts about {title}",
                "difficulty": diff,
                "explanation": f"The article presents factual information about {title}."
            },
            {
                "question": f"Who would be most interested in reading this article?",
                "options": [f"Someone researching {title}", "A chef", "A pilot", "A musician"],
                "answer": f"Someone researching {title}",
                "difficulty": diff,
                "explanation": f"This article is useful for anyone wanting to learn about {title}."
            }
        ]
        
        return fallback_questions[:num_questions]

    def extract_entities(self, content: str) -> dict:
        """Extract named entities from content"""
        
        prompt = f"""Extract named entities from this text into three categories.

TEXT:
{content[:3000]}

Return JSON format:
{{"people": ["Name 1", "Name 2"], "organizations": ["Org 1", "Org 2"], "locations": ["Place 1", "Place 2"]}}

Rules:
- Maximum 6 items per category
- Only extract entities actually mentioned in text
- Use empty array [] if none found
- Return ONLY JSON"""

        response = self._call_llm(prompt, max_tokens=500)
        
        if not response:
            return {"people": [], "organizations": [], "locations": []}
        
        json_str = self._extract_json_from_response(response)
        
        try:
            data = json.loads(json_str)
            return {
                "people": data.get("people", [])[:8],
                "organizations": data.get("organizations", [])[:8],
                "locations": data.get("locations", [])[:8]
            }
        except json.JSONDecodeError:
            return {"people": [], "organizations": [], "locations": []}

    def get_related_topics(self, title: str, links: List[str]) -> List[str]:
        """Get related Wikipedia topics"""
        
        if not links:
            return []
        
        available_links = links[:30]
        
        prompt = f"""From these Wikipedia topics related to "{title}", select the 8 most relevant and interesting.

Topics: {', '.join(available_links)}

Return JSON format:
{{"topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6", "Topic 7", "Topic 8"]}}

Return ONLY JSON."""

        response = self._call_llm(prompt, max_tokens=300)
        
        if not response:
            return available_links[:8]
        
        json_str = self._extract_json_from_response(response)
        
        try:
            data = json.loads(json_str)
            topics = data.get("topics", []) if isinstance(data, dict) else data
            return topics[:8] if isinstance(topics, list) else available_links[:8]
        except json.JSONDecodeError:
            return available_links[:8]

    async def generate_all_async(self, title: str, content: str, sections: List[str], links: List[str], difficulty: str = "mixed", num_questions: int = 6) -> dict:
        """Generate all quiz data asynchronously"""
        
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