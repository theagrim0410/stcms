from db import get_connection

def login_logic(name, email, password):
    if not email or not password or not name:
        return {'error': 'Missing fields'}, 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        
        sql = "SELECT * FROM accounts WHERE email=%s AND name=%s AND password=%s"
        cursor.execute(sql, (email, name, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            print("Login successful for:", user)
            return {
                'message': 'Login successful',
            }, 200
        else:
            print("No user found with provided credentials")
            return {'error': 'Invalid credentials'}, 401
    except Exception as e:
        # print("Login error:", str(e))
        return {'error': str(e)}, 500
