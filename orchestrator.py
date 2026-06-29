import os

from dotenv import load_dotenv

from mistralai.client import Mistral


AGENTS = {
    "architecture": "ag_019f129375e87449a07edcc414b40a1c",
    "performance": "ag_019f129415d670f7b04b68c1d8e12a82",
    "qualité": "ag_019f12956bfc77928ced73a86ff37886",
    "documentation": "ag_019f1286093a7580a5c71169487060f3",
    "mentor": "ag_019f1296d99872e284a2dfa79baa0c8c",
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
    reports = []

    for name, agent_id in AGENTS.items():
        print(f"Calling agent: {name} (ID: {agent_id})")
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
        reports.append(response)

    final_report = call_mistral_agent(
        agent_id=AGENTS["architecture"],
        inputs=f"""
        Fusion ces rapports en un rapport final clair et concis, en mettant en évidence les points clés et les recommandations pour améliorer le dépôt.
        Priorise les actions.
        Ne duplique pas les informations, synthétise-les.

        Reports:
        {reports}
        """
        )
    return final_report

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
                    print(f"Could not read file {file_path}: {e}")

    return "\n".join(summary)

if __name__ == "__main__":
    repo_path = './frontend'
    repo_summary = build_repo_summary(repo_path)
    final_report = orchestrate(repo_summary)
    print("Final Report:")
    print(final_report)
    # output_file into a markdown file
    output_file = "final_report.md"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(final_report)
    print(f"Final report saved to {output_file}")