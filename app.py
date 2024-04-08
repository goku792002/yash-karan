from flask import Flask, render_template, request
from openaiQuery import query_openai, fetch_all_thoughts
from database import create_connection

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    #Render the HTML page with the form on it
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    #get the user's query from the HTML page
    user_query = request.form['user_query']
    #connect to the database
    conn = create_connection('thoughts.db')
    thoughts = fetch_all_thoughts(conn)
    answer, relevant_thoughts = query_openai(user_query, thoughts)
    conn.close()

    return render_template('answer.html', answer=answer, relevant_thoughts=relevant_thoughts)

if __name__ == '__main__':
    app.run(debug=True)