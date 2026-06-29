import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

from dotenv import load_dotenv

from mistralai.client import Mistral

from logging import getLogger

logger = getLogger(__name__)


AGENTS = {
    "architecture": "ag_019f129375e87449a07edcc414b40a1c",
    "performance": "ag_019f129415d670f7b04b68c1d8e12a82",
    "qualité": "ag_019f12956bfc77928ced73a86ff37886",
    "documentation": "ag_019f1286093a7580a5c71169487060f3",
    "mentor": "ag_019f1296d99872e284a2dfa79baa0c8c",
    "sécurité": "ag_019f13cd13d67262a519c7909dd0e63d",
    "accessibilité": "ag_019f13ce4d8976a99c452ce7347bc919",
    "devops": "ag_019f13cf472777b887acc7d241ec7bd4",
    "ui/ux": "ag_019f13d0b1d370c1aad0f9b89397a6fa",
}

ORCHESTRATOR_AGENT_ID = "ag_019f12a4060a77d8b5cbc0b76e8873c6"
PRODUCT_OWNER_AGENT_ID = "ag_019f12a5e16075749f2d0cbfd1c89bb4"

def _extract_text(response) -> str:
    parts = []
    for output in response.outputs:
        content = getattr(output, "content", None)
        if content is None:
            continue
        if isinstance(content, str):
            parts.append(content)
        elif isinstance(content, list):
            for chunk in content:
                text = getattr(chunk, "text", None)
                if text:
                    parts.append(text)
    return "\n".join(parts)


def run_specialist_agent(name: str, agent_id: str, repo_summary: str) -> tuple[str, str]:
    logger.info(f"Calling agent: {name} (ID: {agent_id})")
    response = call_mistral_agent(
        agent_id=agent_id,
        inputs=f"""
        Analyse ce dépôt selon ton rôle : {name}.
        Retourn uniquement un markdown valide AgentReport avec les champs suivants :
        - agent_name : le nom de l'agent
        - report : le rapport d'analyse du dépôt selon ton rôle
        - recommendations : une liste de recommandations pour améliorer le dépôt selon ton rôle

        Sommaire du dépôt :
        {repo_summary}
        """
    )
    return name, response


def call_mistral_agent(agent_id, inputs) -> str:
    print(f"Calling Mistral agent with ID: {agent_id}")
    print(f"Input to agent: {inputs}")
    load_dotenv()
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY is not set in the environment variables.")

    client = Mistral(api_key=api_key)

    if not agent_id:
        raise ValueError(f"Agent '{agent_id}' not found.")

    response = client.beta.conversations.start(agent_id=agent_id, agent_version="latest", inputs=inputs)
    return _extract_text(response)


def orchestrate(repo_summary: str):
    reports_by_agent = {}

    with ThreadPoolExecutor(max_workers=len(AGENTS)) as executor:
        future_to_agent = {
            executor.submit(run_specialist_agent, name, agent_id, repo_summary): name
            for name, agent_id in AGENTS.items()
        }

        for future in tqdm(as_completed(future_to_agent), total=len(future_to_agent), desc="Calling agents", unit="agent"):
            agent_name = future_to_agent[future]
            try:
                name, report = future.result()
                reports_by_agent[name] = report
            except Exception as e:
                logger.error(f"Error calling agent {agent_name}: {e}")
                reports_by_agent[agent_name] = f"Error: {e}"

    reports = [
        f"## Rapport de l'agent {name}\n\n{report}"
        for name, report in reports_by_agent.items()
    ]

    final_report = call_mistral_agent(
        agent_id=ORCHESTRATOR_AGENT_ID,
        inputs=f"""
        Tu es un orchestrateur d'agents. Tu as reçu les rapports de plusieurs agents qui ont analysé un dépôt.

        Priorise les actions.
        Ne duplique pas les informations, synthétise-les.
        Détecte les contradictions.
        Classe les problèmes par ordre de priorité et propose des solutions concrètes pour les résoudre.

        Rapports des agents :
        {reports}

        Fournis un rapport final complet et structuré en markdown.

        Vérifier que le rapport final contient tout ce qui est nécessaire pour que le Product Owner puisse créer une feuille de route claire et concise. Pas de phrases incomplètes, pas de phrases vagues, pas de phrases génériques. Pas de phrases qui ne sont pas directement liées au dépôt analysé.

        """
    )
    return final_report

def make_roadmap(final_report: str):
    roadmap = call_mistral_agent(
        agent_id=PRODUCT_OWNER_AGENT_ID,
        inputs=f"""
        Tu es un Product Owner. Tu as reçu un rapport final d'analyse d'un dépôt.
        Produis une feuille de route claire et concise.

        Découpe en tickets.

        Estime les priorités et les efforts nécessaires pour chaque ticket.

        Liste les dépendances entre les tickets.

        Liste les risques et les obstacles potentiels pour chaque ticket.

        Liste les métriques de succès pour chaque ticket.

        Liste les parties prenantes et les responsabilités pour chaque ticket.

        Rapport final :
        {final_report}
        """
    )
    return roadmap

def build_repo_summary(repo_path: str) -> str:
    ignored = {".git", "node_modules", "__pycache__", "dist", "build", ".venv", "venv", ".git", "coverage", ".idea", ".vscode", ".DS_Store", ".pytest_cache", ".mypy_cache", ".tox", ".eggs", "env", "ENV", "env.bak", "env.bak2", "env.bak3"}

    summary = []

    for dirpath, dirnames, filenames in os.walk(repo_path):
        # Filter out ignored directories
        dirnames[:] = [d for d in dirnames if d not in ignored]

        for filename in filenames:
            if filename in ignored:
                continue
            if filename.endswith((".pyc", ".pyo", ".exe", ".dll", ".so", ".dylib", ".bin", ".o", ".obj", ".class", ".jar", ".zip", ".tar", ".gz", ".7z", ".ts", ".html", ".css", ".js", ".json", ".md", ".txt")):
                file_path = os.path.join(dirpath, filename)
                relative_path = os.path.relpath(file_path, repo_path)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read(4000)
                    summary.append(f"\n---File: {relative_path}---\nContent:\n{content}")
                except Exception as e:
                    logger.error(f"Could not read file {file_path}: {e}")

    return "\n".join(summary)

if __name__ == "__main__":
    repo_path = input("Enter the path to the repository to analyze (default: './apps'): ") or './apps'
    repo_summary = build_repo_summary(repo_path)
    final_report = orchestrate(repo_summary)
    roadmap = make_roadmap(final_report)
    output_file = f"final_report_{repo_path.replace('./', '').replace('/', '_')}.md"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(final_report)
        f.write("\n\n")
        f.write("Roadmap:\n")
        f.write(roadmap)
    logger.info(f"Final report and roadmap saved to {output_file}")