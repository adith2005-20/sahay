import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL and Key must be set in the .env file.")
supabase: Client = create_client(supabase_url, supabase_key)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("Gemini API Key must be set in the .env file.")
genai.configure(api_key=gemini_api_key)
llm = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

class UserRequest(BaseModel):
    user_id: str

def create_prompt(combined_data: dict) -> str:
    """Formats the combined RIASEC and quiz data into an advanced prompt."""
    system_prompt = """
    You are a pragmatic, realistic, and empathetic career counselor specializing in advising 14-15-year-old students in India about choosing between Science, Commerce, and Arts/Humanities streams for grades 11 and 12.

    ## Your Core Mission
    Your primary goal is to synthesize a student's personality profile (RIASEC scores) with their academic performance (quiz results) to provide a wise, realistic, and actionable stream recommendation that balances their interests with their academic capabilities.

    ## Input Data Structure
    You will receive a single JSON object with two main keys:

    ### riasec_scores
    Personality and interest scores (0-100 scale, higher = stronger match):
    - **Realistic (R)**: Hands-on, practical, technical work
    - **Investigative (I)**: Research, analysis, problem-solving
    - **Artistic (A)**: Creative expression, innovation, aesthetics
    - **Social (S)**: Helping people, teaching, counseling
    - **Enterprising (E)**: Leadership, business, persuasion
    - **Conventional (C)**: Organization, data management, structured work

    ### quiz_results
    Academic reality check containing:
    - **Academic levels** (0=Poor, 1=Below Average, 2=Average, 3=Excellent):
      - `math_level`: Mathematics performance
      - `science_level`: Science subjects performance
      - `sst_level`: Social Science/History performance
      - `commerce_level`: Business/Economics concepts performance
    - **Learning style preference**: How the student learns best
    - **Effort level** (1=Low, 2=Moderate, 3=High): Student's willingness to work hard

    ## Critical Decision-Making Rules
    1.  **Synthesize, Don't Just Report**: Never simply list scores.
    2.  **Academic Reality is the Deciding Factor**: Academic scores (`*_level`) act as hard filters.
    3.  **Address Conflicts Directly**: When RIASEC interests conflict with academic capabilities, explicitly acknowledge this.
    
    ## COMBINED USER DATA:
    {combined_data_json}

    ## Output Requirements
    Respond ONLY with a valid JSON object in this exact format:
    {{
      "suggestion": "Science | Commerce | Arts/Humanities",
      "reasoning": "A detailed, step-by-step explanation that synthesizes both RIASEC scores and academic quiz results, written in simple language for a 14-year-old."
    }}
    """
    
    combined_data_str = json.dumps(combined_data, indent=2)
    return system_prompt.format(combined_data_json=combined_data_str)

@app.post("/suggest-path")
async def suggest_path(user_request: UserRequest):
    """API endpoint to receive user_id, fetch data, and return LLM suggestion."""
    
    try:
        user_id = user_request.user_id

        riasec_response_list = supabase.table('user_riasec_record').select('*').eq('user_id', user_id).order('created_at', desc=True).limit(1).execute()
        if not riasec_response_list.data:
            riasec_scores = {}
        else:
            riasec_data = riasec_response_list.data[0]
            riasec_scores = {k: v for k, v in riasec_data.items() if k not in ['id', 'user_id', 'created_at']}

        quiz_response_list = supabase.table('quiz_responses').select('response_data').eq('user_id', user_id).eq('quiz_type', '9_10').order('created_at', desc=True).limit(1).execute()
        
        if not quiz_response_list.data:
            raise HTTPException(status_code=404, detail=f"No quiz responses of type '9_10' found for user_id: {user_id}")

        full_quiz_data = quiz_response_list.data[0].get('response_data', {})
        quiz_results = full_quiz_data.get('responseData', {}).get('results')

        if not quiz_results:
            raise HTTPException(status_code=400, detail="Malformed quiz data in database. 'results' object not found.")

        combined_data_for_llm = {
            "riasec_scores": riasec_scores,
            "quiz_results": quiz_results
        }
        
        prompt = create_prompt(combined_data_for_llm)
        llm_response = llm.generate_content(prompt)

        return llm_response.text

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred")

if __name__ == "__main__":
    def run_test():
        print("--- Running in Test Mode ---")
        
        user_id = "fb376fe8-f324-4ddb-a122-2fe5d993d893"
        print(f"Testing with user_id: {user_id}")

        riasec_response_list = supabase.table('user_riasec_record').select('*').eq('user_id', user_id).order('created_at', desc=True).limit(1).execute()
        
        if not riasec_response_list.data:
            riasec_scores = {}
        else:
            riasec_data = riasec_response_list.data[0]
            riasec_scores = {k: v for k, v in riasec_data.items() if k not in ['id', 'user_id', 'created_at']}
        
        quiz_response_list = supabase.table('user_quiz_responses').select('response_data').eq('user_id', user_id).eq('quiz_type', '9_10').order('created_at', desc=True).limit(1).execute()
        
        if not quiz_response_list.data:
            print(f"Error: No quiz responses of type '9_10' found for user_id: {user_id}")
            return

        full_quiz_data = quiz_response_list.data[0].get('response_data', {})
        quiz_results = full_quiz_data.get('responseData', {}).get('results')
        print(quiz_results)
        if not quiz_results:
            print("Error: Malformed quiz data in database.")
            return

        combined_data_for_llm = {
            "riasec_scores": riasec_scores,
            "quiz_results": quiz_results
        }
        
        prompt = create_prompt(combined_data_for_llm)
        print("\n--- Sending Prompt to LLM... ---")
        
        llm_response = llm.generate_content(prompt)
        print(llm_response.text)
        # suggestion = json.loads(llm_response.text)
        
        print("\n--- LLM Response Received ---")
        # print(json.dumps(suggestion, indent=2))

    run_test()