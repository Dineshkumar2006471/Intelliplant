import psycopg2

import os
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.environ.get("DATABASE_URL", "")
SCHEMA_FILE = r"c:\Users\bingi\Intelliplant\schema.sql"

def setup_db():
    print("Connecting to database...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    
    print(f"Reading {SCHEMA_FILE}...")
    with open(SCHEMA_FILE, "r") as f:
        sql = f.read()
    
    print("Executing schema SQL...")
    try:
        cursor.execute(sql)
        print("Schema executed successfully!")
    except Exception as e:
        print(f"Error executing schema: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    setup_db()
