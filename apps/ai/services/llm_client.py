from django.conf import settings
from openai import OpenAI

class LLMClient:
    def __init__(self):
        self.client = OpenAI(api_key=settings.TONGYI_API_KEY, base_url=settings.TONGYI_API_URL)
        self.model = settings.TONGYI_MODEL
    
    def chat(self, system_prompt, user_prompt):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        return response.choices[0].message.content