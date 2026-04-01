import json
import os
from datetime import datetime
from db import get_connection


def ensure_vehicles_schema(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vehicles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT,
            time DATETIME,
            temple VARCHAR(255),
            email VARCHAR(255)
        )
    """)

    cursor.execute("SHOW COLUMNS FROM vehicles LIKE 'temple'")
    if cursor.fetchone() is None:
        cursor.execute("ALTER TABLE vehicles ADD COLUMN temple VARCHAR(255)")

    cursor.execute("SHOW COLUMNS FROM vehicles LIKE 'email'")
    if cursor.fetchone() is None:
        cursor.execute("ALTER TABLE vehicles ADD COLUMN email VARCHAR(255)")

def insert_vehicles(json_file, temple=None, email=None):


    if not os.path.exists(json_file):
        print("No detection found (file not found)")
        return

    conn = get_connection()
    cursor = conn.cursor()

    ensure_vehicles_schema(cursor)

    with open(json_file, 'r') as file:
        try:
            data = json.load(file)
        except json.JSONDecodeError:
            print("No detection found (invalid JSON)")
            return

    if not data:
        print("No detection found (empty file)")
        return

    if isinstance(data, dict):
        data = [data]

    inserted = 0

    for item in data:
        vehicle_id = item.get("vehicle_id")
        raw_time = item.get("time")

        if not vehicle_id or not raw_time:
            continue  # skip bad data

        try:
 
            formatted_time = datetime.strptime(
                raw_time, "%a %b %d %H:%M:%S %Y"
            )

            cursor.execute(
                "INSERT INTO vehicles (vehicle_id, time, temple, email) VALUES (%s, %s, %s, %s)",
                (vehicle_id, formatted_time, temple, email)
            )

            inserted += 1

        except Exception:
            continue  
    conn.commit()
    cursor.close()
    conn.close()

    if inserted == 0:
        print("No detection found")
    else:
        print(f"{inserted} vehicle records inserted successfully")