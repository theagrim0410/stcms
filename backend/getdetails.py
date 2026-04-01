from db import get_connection

def get_temple_by_user(name, email):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT p.account_id, p.address, p.area, p.networth, p.owner, p.no_of_properties
        FROM user_properties p
        INNER JOIN accounts a ON a.id = p.account_id
        WHERE a.name = %s AND a.email = %s
        ORDER BY p.id DESC
        LIMIT 1
        """

        cursor.execute(query, (name, email))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result:
            return result, 200
        else:
            return {"error": "No temple data found"}, 404

    except Exception as e:
        return {"error": str(e)}, 500
    


def get_vehicle_data():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM vehicles ORDER BY id DESC LIMIT 5"
    cursor.execute(query)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


def get_people_data():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM people ORDER BY id DESC LIMIT 5"
    cursor.execute(query)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data