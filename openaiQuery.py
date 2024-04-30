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
        {"role": "user", "content": f"Here are my thoughts:\n{fetch_all_thoughts(conn)}\n\nGiven these thoughts, answer the following question and list the exact thoughts that are most relevant. The format is as follows: answer the question briefly first and then list every relevant thought on a new line and start the list with the text 'Relevant thoughts' before listing out the thoughts: {user_query} "}
    ]

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7,
        max_tokens=3000,
    )

    # Access the content of the message, which should be a string
    message_content = completion.choices[0].message.content

    parts = message_content.split('\n\nRelevant thoughts:\n')
    answer = parts[0].strip() if parts else ""

    relevant_thoughts = get_relevant_thoughts(message_content)

    return answer, relevant_thoughts

# Example function to extract relevant thoughts
def get_relevant_thoughts(completion_message):
    # Split the response by newlines
    
    lines = completion_message.split('\n')

    # Find the index of the line that contains 'Relevant thoughts:'
    try:
        start_index = lines.index('Relevant thoughts:') + 1
    except ValueError:
        # If 'Relevant thoughts:' is not found, return an empty list
        return []

    # Extract the thoughts from the lines following 'Relevant thoughts:'
    relevant_thoughts = []
    for line in lines[start_index:]:
        # Check if the line is a thought (begins with '- ')
        if line.startswith('- '):
            # Remove the '- ' and add the thought to the list
            relevant_thoughts.append(line[2:].strip())
        else:
            # If the line does not start with '- ', it's not a thought
            break  # Stop processing if we've passed the relevant thoughts

    return relevant_thoughts

if __name__ == "__main__":
    query = "why am I sad?"
    answer = query_openai(query, fetch_all_thoughts(conn))
    print("THIS IS THE ANSWER", answer)
