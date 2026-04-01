from db import get_connection
import mysql.connector


def ensure_user_properties_schema(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_properties (
            id INT AUTO_INCREMENT PRIMARY KEY,
            account_id INT,
            address VARCHAR(255),
            area VARCHAR(100),
            owner VARCHAR(100),
            networth DECIMAL(15,2),
            no_of_properties INT,
            email VARCHAR(255),
            FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
        )
    """)

    cursor.execute("SHOW COLUMNS FROM user_properties LIKE 'email'")
    if cursor.fetchone() is None:
        cursor.execute("ALTER TABLE user_properties ADD COLUMN email VARCHAR(255)")

def create_account_logic(name, email, password, cnfpassword):
    if not name or not email or not password or not cnfpassword:
        return {'error': 'Missing fields'}, 400

    if password != cnfpassword:
        return {'error': 'Passwords do not match'}, 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Create accounts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                cnfpassword VARCHAR(255)
            )
        """)

        ensure_user_properties_schema(cursor)

       
        sql = "INSERT INTO accounts (name, email, password, cnfpassword) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (name, email, password, cnfpassword))

        # Get inserted user id
        account_id = cursor.lastrowid

        conn.commit()
        cursor.close()
        conn.close()

        return {
            'message': 'Account created successfully',
            'account_id': account_id
        }, 201

    except mysql.connector.IntegrityError:
        return {'error': 'Email already exists'}, 400

    except Exception as e:
        return {'error': str(e)}, 500
    
    
def add_property_logic(account_id, address, area, owner, networth, no_of_properties,email):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        ensure_user_properties_schema(cursor)

        sql = """
        INSERT INTO user_properties 
        (account_id, address, area, owner, networth, no_of_properties,email)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (account_id, address, area, owner, networth, no_of_properties, email))
        conn.commit()   

        cursor.close()
        conn.close()

        return {'message': 'Property added successfully'}, 201

    except Exception as e:
        return {'error': str(e)}, 500

