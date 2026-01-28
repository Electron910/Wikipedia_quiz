QUIZ_GENERATION_PROMPT = """You are an expert quiz creator. Based on the following Wikipedia article content, generate exactly 8 quiz questions.

Article Title: {title}
Article Sections: {sections}
Article Content: {content}

Requirements:
1. Generate exactly 8 multiple-choice questions
2. Each question must have exactly 4 options
3. Questions should cover different sections and topics from the article
4. Include a mix of difficulty levels: 2-3 easy, 3-4 medium, 1-2 hard
5. All answers must be factually correct based on the article content
6. Explanations should reference specific parts of the article
7. Do NOT make up information not present in the article

Return ONLY valid JSON in this exact format:
{{
    "questions": [
        {{
            "question": "Your question here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "The correct option exactly as written",
            "difficulty": "easy|medium|hard",
            "explanation": "Brief explanation referencing the article."
        }}
    ]
}}

Generate the quiz now:"""

ENTITY_EXTRACTION_PROMPT = """Extract key entities from the following Wikipedia article content.

Content: {content}

Identify and categorize:
1. People: Names of individuals mentioned
2. Organizations: Companies, institutions, groups
3. Locations: Countries, cities, places

Return ONLY valid JSON in this exact format:
{{
    "people": ["Person 1", "Person 2"],
    "organizations": ["Org 1", "Org 2"],
    "locations": ["Location 1", "Location 2"]
}}

Extract entities now:"""

RELATED_TOPICS_PROMPT = """Based on the following Wikipedia article, suggest related topics for further reading.

Article Title: {title}
Article Content: {content}
Links found in article: {links}

Suggest 8-10 related Wikipedia topics that would be interesting for someone who read this article.
Topics should be directly related and educational.

Return ONLY valid JSON in this exact format:
{{
    "topics": ["Topic 1", "Topic 2", "Topic 3"]
}}

Suggest topics now:"""