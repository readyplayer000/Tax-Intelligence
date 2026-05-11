try:
    # pyrefly: ignore [missing-import]
    from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
    print("Imported AgentExecutor and create_tool_calling_agent from langchain_classic.agents")
except ImportError as e:
    print(f"Error importing from langchain_classic.agents: {e}")

try:
    # pyrefly: ignore [missing-import]
    import langchain.agents
    print(f"langchain.agents dir: {dir(langchain.agents)}")
except Exception as e:
    print(f"Error checking langchain.agents: {e}")
