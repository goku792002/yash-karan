import os
from openai import OpenAI
from database import create_connection
import re

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
    # """Fetch two thoughts from the database."""
    # try:
    #     c = conn.cursor()
    #     c.execute("SELECT thoughts FROM thoughts LIMIT 2")  # Query modified to fetch only two rows
    #     rows = [row[0] for row in c.fetchall()]
    #     return rows
    # except Exception as e:
    #     print(e)
    #     return []
    
# print (fetch_all_thoughts(conn))

def query_openai(user_query, thoughts):
    
    # Prompt for OpenAI
    messages = [
        {"role": "system", "content": "You are a helpful assistant capable of summarizing personal thoughts and answering self-reflection questions based on them."},
        {"role": "user", "content": f"Here are my thoughts:{', '.join(fetch_all_thoughts(conn))} Given these thoughts, answer the following question in a brief manner and then list the exact thoughts that are most relevant. You must include the phrase 'Relevant thoughts:' in your response before listing the thoughts and you must include a '-' at the beginning of each thought on a new line. You must give a brief summary of the answer and then a list of relevant thoughts you considered. Start the brief summary straight away, without including anything like 'summary:' Here is the user question: {user_query}."}
    ]

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7,
        max_tokens=4000,
    )

#     # Access the content of the message, which should be a string
#     message_content = completion.choices[0].message.content

    # Use a regular expression to split the message content
    parts = re.split(r'Relevant thoughts:', message_content, flags=re.IGNORECASE)
    answer = parts[0].strip() if parts else ""

    # Remove any words before the colon, including the colon itself
    answer = re.sub(r'^.*?:\s*', '', answer).strip()
    relevant_thoughts_section = parts[1].strip() if len(parts) > 1 else ""

    # Now call get_relevant_thoughts with the split relevant thoughts section
    relevant_thoughts = get_relevant_thoughts(relevant_thoughts_section)

#     return answer, relevant_thoughts

# Example function to extract relevant thoughts
def get_relevant_thoughts(relevant_thoughts_section):
    # Split the relevant thoughts section into lines
    lines = relevant_thoughts_section.split('-')[1:]  # Skip the empty item before the first '-'
    relevant_thoughts = [line.strip().strip('"').rstrip('.').strip() for line in lines if line.strip()]

    return relevant_thoughts

# if __name__ == "__main__":
#     query = "why am I sad?"
#     answer = query_openai(query, fetch_all_thoughts(conn))
#     print("THIS IS THE ANSWER", answer)
