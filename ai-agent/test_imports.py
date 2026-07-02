try:
    # pyrefly: ignore [missing-import]
    from langchain_classic.agents import AgentExecutor
    print("Found in langchain_classic.agents")
except ImportError:
    print("Not found in langchain_classic.agents")

try:
    # pyrefly: ignore [missing-import]
    from langchain.agents import AgentExecutor
    print("Found in langchain.agents")
except ImportError:
    print("Not found in langchain.agents")

# pyrefly: ignore [missing-import]
import langchain
print(f"Langchain version: {langchain.__version__}")
