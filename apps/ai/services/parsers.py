import json
import re


def parse_json_response(raw_response) -> dict:
    try:
        return json.loads(raw_response)
    except json.JSONDecodeError:
        match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', raw_response, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                raise ValueError(f'JSON trouvé dans un bloc de code, mais il est mal formé: {match.group(1)}')
            
        match1 = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', raw_response, re.DOTALL)
        if not match1:
            raise ValueError("Aucun JSON trouvé dans la réponse")
        
        try:
            json_str = match1.group(0)
            json_str = json_str.replace("\n", ' ')
            json_str = re.sub(r',\s*}', '}', json_str)
            json_str = re.sub(r',\s*]', ']', json_str)
            return json.loads(json_str)
        except json.JSONDecodeError:
            raise ValueError(f'JSON trouvé dans la réponse, mais il est mal formé: {json_str}')
