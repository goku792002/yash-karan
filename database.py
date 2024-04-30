import sqlite3
import random

def create_connection(db_file):
    """Create a database connection to the SQLite database specified by db_file."""
    conn = None
    try:
        conn = sqlite3.connect(db_file, check_same_thread=False)
    except sqlite3.Error as e:
        print(e)
    return conn

def create_table(conn):
    """Create a table if it does not exist already."""
    try:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS thoughts (
                     thoughts text,
                     value_tag text,
                     timestamp datetime
                  )''')
        print("Table created successfully")
        conn.commit()
    except sqlite3.Error as e:
        print(e)

def view_thoughts(conn):
    """Query all rows in the thoughts table."""
    try:
        c = conn.cursor()
        c.execute("SELECT * FROM thoughts")
        rows = c.fetchall()
        print("All thoughts:")

        for row in rows:
            print(row)

    except sqlite3.Error as e:
        print(e)


def insert_thought(conn, text):
    """Insert a new thought into the thoughts table."""
    c = conn.cursor()
    c.execute("INSERT INTO thoughts (thoughts, value_tag, timestamp) VALUES (?, 'Untagged', datetime('now'))", (text,))
    conn.commit()

def get_random_thought(conn):
    """Get a random thought from the thoughts table."""
    try:
        c = conn.cursor()
        c.execute("SELECT thoughts FROM thoughts")
        rows = c.fetchall()
        random_thought=random.choice(rows) if rows else None
        return random_thought[0] if random_thought else 'No thoughts available'
    except sqlite3.Error as e:
        print(e)
        return 'Error fetching thoughts'


def main():
    # Create a database connection
    database = "thoughts.db"
    conn = create_connection(database)

    with conn:
        # Create table (if not already created)
        create_table(conn)

        # View thoughts
        view_thoughts(conn)

if __name__ == '__main__':
    main()