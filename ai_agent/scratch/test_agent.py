import os
import sys

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.agent import run_agent

if __name__ == "__main__":
    user_id = "test_user"
    financial_year = "2024-25"
    message = "Hello, can you help me with my taxes?"
    
    print(f"Running agent with message: {message}")
    response = run_agent(user_id, financial_year, message)
    print("\nAgent Response:")
    print(f"Response type: {type(response)}")
    try:
        print(response)
    except UnicodeEncodeError:
        if isinstance(response, str):
            print(response.encode('ascii', 'ignore').decode('ascii'))
        else:
            print(repr(response))
    except Exception as e:
        print(f"Error printing response: {e}")
        try:
            print(str(response).encode('ascii', 'ignore').decode('ascii'))
        except:
            pass
