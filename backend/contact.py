from db import get_connection

def save_contact(name, email, message):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        sql1 = "CREATE TABLE IF NOT EXISTS contact (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), message TEXT)"
        cursor.execute(sql1)
        
        query = "INSERT INTO contact (name, email, message) VALUES (%s, %s, %s)"
        values = (name, email, message)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return {"message": "Message saved successfully 🙏"}, 200

    except Exception as e:
        return {"error": str(e)}, 500