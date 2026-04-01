import json
import os
from datetime import datetime
from db import get_connection


def ensure_people_schema(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            person_id INT,
            time DATETIME,
            temple VARCHAR(255),
            email VARCHAR(255)
        )
    """)

    cursor.execute("SHOW COLUMNS FROM people LIKE 'temple'")
    if cursor.fetchone() is None:
        cursor.execute("ALTER TABLE people ADD COLUMN temple VARCHAR(255)")

    cursor.execute("SHOW COLUMNS FROM people LIKE 'email'")
    if cursor.fetchone() is None:
        cursor.execute("ALTER TABLE people ADD COLUMN email VARCHAR(255)")

def insert_people(json_file, temple=None, email=None):

    if not os.path.exists(json_file):
        print("No detection found (file not found)")
        return

    conn = get_connection()
    cursor = conn.cursor()

    ensure_people_schema(cursor)

    with open(json_file, 'r') as file:
        content = file.read().strip()

    objects = content.replace('}{', '}|{').split('|')

    inserted = 0

    for obj in objects:
        try:
            data = json.loads(obj)
        except:
            continue

        entries = data.get("entries", [])

        for item in entries:
            person_id = item.get("person_id")
            raw_time = item.get("time")

            if person_id is None or raw_time is None:
                continue

            try:
                formatted_time = datetime.strptime(
                    raw_time, "%a %b %d %H:%M:%S %Y"
                )

                cursor.execute(
                    "INSERT INTO people (person_id, time, temple, email) VALUES (%s, %s, %s, %s)",
                    (person_id, formatted_time, temple, email)
                )

                inserted += 1

            except Exception as e:
                print("Time error:", e)

    conn.commit()
    cursor.close()
    conn.close()

    if inserted == 0:
        print("No detection found")
    else:
        print(f"{inserted} people records inserted successfully")