import os
from openai import OpenAI
from database import create_connection

api_key= os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

# connect to the database
conn = create_connection('thoughts.db')

def fetch_all_thoughts(conn):
    """Fetch all thoughts from the database"""
    c = conn.cursor()
    c.execute("SELECT thoughts FROM thoughts")
    rows = [row[0] for row in c.fetchall()]
    return rows

def query_openai(user_query, thoughts):
    
    # Prompt for OpenAI
    messages = [
        {"role": "system", "content": "You are a helpful assistant capable of summarizing personal thoughts and answering self-reflection questions based on them."},
        {"role": "user", "content": f"Here are my thoughts:\n{fetch_all_thoughts(conn)}\n\nGiven these thoughts, answer the following question and list the exact thoughts that are most relevant: {user_query}"}
    ]

    completion = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        temperature=0.7,
        max_tokens=3000,
    )

    answer = completion.choices[0].message
    return answer

query = "why am I sad?"
answer = query_openai(query, fetch_all_thoughts(conn))
print ("THIS IS THE ANSWER", answer)
