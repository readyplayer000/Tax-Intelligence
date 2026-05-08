try:
    from langchain_classic.agents import AgentExecutor
    print("Found in langchain_classic.agents")
except ImportError:
    print("Not found in langchain_classic.agents")

try:
    from langchain.agents import AgentExecutor
    print("Found in langchain.agents")
except ImportError:
    print("Not found in langchain.agents")

import langchain
print(f"Langchain version: {langchain.__version__}")
