import json
import re


def parse_json_response(raw_response) -> dict:
    try:
        return json.loads(raw_response)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if not match:
            raise ValueError("Aucun JSON trouvé dans la réponse")
        return json.loads(match.group(0))
