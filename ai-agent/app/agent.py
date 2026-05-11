from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
import os
import requests
from dotenv import load_dotenv, find_dotenv

# Load .env from the root directory
dotenv_path = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(dotenv_path)

if not os.getenv("GOOGLE_API_KEY"):
    print("WARNING: GOOGLE_API_KEY not found in .env!")
else:
    print("SUCCESS: GOOGLE_API_KEY loaded successfully.")

@tool
def fetch_tax_data(user_id: str, financial_year: str):
    """Fetches all income, expense, and deduction data for a user for a specific financial year."""
    try:
        backend_url = os.getenv("BACKEND_INTERNAL_URL", "http://localhost:4000")
        response = requests.get(f"{backend_url}/api/entries?userId={user_id}&fy={financial_year}")
        if response.status_code == 200:
            entries = response.json()
            summary = {
                "total_income": 0,
                "total_expense": 0,
                "total_investment": 0,
                "income_breakdown": {},
                "expense_breakdown": {},
                "investment_breakdown": {}
            }
            for entry in entries:
                cat = entry.get("category")
                sub = entry.get("subCategory", "Other")
                amt = float(entry.get("amount", 0))
                
                if cat == "INCOME":
                    summary["total_income"] += amt
                    summary["income_breakdown"][sub] = summary["income_breakdown"].get(sub, 0) + amt
                elif cat == "EXPENSE":
                    summary["total_expense"] += amt
                    summary["expense_breakdown"][sub] = summary["expense_breakdown"].get(sub, 0) + amt
                elif cat == "INVESTMENT":
                    summary["total_investment"] += amt
                    summary["investment_breakdown"][sub] = summary["investment_breakdown"].get(sub, 0) + amt
            return summary
        return []
    except Exception as e:
        print(f"Error fetching tax data: {e}")
        return []

@tool
def calculate_80c_headroom(invested_amount: float):
    """Calculates how much more a user can invest under Section 80C to reach the ₹1.5L limit."""
    limit = 150000
    headroom = max(0, limit - invested_amount)
    return {"limit": limit, "invested": invested_amount, "remaining": headroom}

@tool
def compare_tax_regimes(total_income: float, deductions: float):
    """Compares tax liability between Old and New Tax Regimes for FY 2024-25."""
    # Standard Deductions
    std_deduction_new = 75000
    std_deduction_old = 50000

    def calculate_new_tax(income):
        taxable = max(0, income - std_deduction_new)
        tax = 0
        slabs = [
            (300000, 0.00),
            (300000, 0.05),
            (300000, 0.10),
            (300000, 0.15),
            (300000, 0.20),
            (float('inf'), 0.30)
        ]
        remaining = taxable
        for slab_limit, rate in slabs:
            taxable_in_slab = min(remaining, slab_limit)
            tax += taxable_in_slab * rate
            remaining -= taxable_in_slab
            if remaining <= 0: break
        # Rebate under 87A (New Regime rebate up to 7L income)
        if taxable <= 700000: tax = 0
        return tax

    def calculate_old_tax(income, ded):
        taxable = max(0, income - std_deduction_old - ded)
        tax = 0
        if taxable <= 250000: tax = 0
        elif taxable <= 500000: tax = (taxable - 250000) * 0.05
        elif taxable <= 1000000: tax = 12500 + (taxable - 500000) * 0.20
        else: tax = 112500 + (taxable - 1000000) * 0.30
        
        # Rebate under 87A (Old Regime rebate up to 5L income)
        if taxable <= 500000: tax = 0
        return tax

    new_tax = calculate_new_tax(total_income)
    old_tax = calculate_old_tax(total_income, deductions)
    
    # Adding 4% Cess
    new_tax_total = new_tax * 1.04
    old_tax_total = old_tax * 1.04

    return {
        "new_regime": {
            "taxable_income": max(0, total_income - std_deduction_new),
            "tax_amount": round(new_tax_total, 2)
        },
        "old_regime": {
            "taxable_income": max(0, total_income - std_deduction_old - deductions),
            "tax_amount": round(old_tax_total, 2)
        },
        "recommendation": "New Regime" if new_tax_total < old_tax_total else "Old Regime",
        "savings": round(abs(new_tax_total - old_tax_total), 2)
    }

from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
    max_retries=2,
)

tools = [fetch_tax_data, calculate_80c_headroom, compare_tax_regimes]

# Use absolute path for the prompt file
current_dir = os.path.dirname(os.path.abspath(__file__))
prompt_path = os.path.join(current_dir, "prompts", "system_prompt.txt")
with open(prompt_path) as f:
    system_prompt = f.read()

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent, 
    tools=tools, 
    verbose=True,
    handle_parsing_errors=True
)

def run_agent(user_id: str, financial_year: str, message: str) -> str:
    try:
        result = agent_executor.invoke({
            "input": f"[USER_ID: {user_id}] [FY: {financial_year}] User Query: {message}"
        })
        output = result["output"]
        if isinstance(output, list):
            extracted = []
            for item in output:
                if isinstance(item, dict) and "text" in item:
                    extracted.append(item["text"])
                elif isinstance(item, str):
                    extracted.append(item)
                else:
                    extracted.append(str(item))
            return "\n".join(extracted)
        elif not isinstance(output, str):
            return str(output)
        return output
    except Exception as e:
        print(f"Agent Error: {e}")
        return f"I apologize, but I encountered an error: {str(e)}. Please try again."
