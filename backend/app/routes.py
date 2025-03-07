from flask import request, jsonify, Blueprint, current_app, make_response
from psycopg2 import sql, Error
from flask_jwt_extended import create_access_token
from app.db import get_db_connection, release_db_connection
from app import bcrypt

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({"message": "Welcome to the Fitness App API!"})

# Signup Route
@main.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    fname = data.get('firstName')
    lname = data.get('lastName')

    if not fname or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        insert_query = sql.SQL("CALL user_signup(%s, %s, %s, %s, NULL);")
        cursor.execute(insert_query, (fname, lname, email, hashed_password))
        user_id = cursor.fetchone()[0]
        conn.commit()
        release_db_connection(conn)
        if not user_id:
            return jsonify({'error': 'User already exists'}), 400
        else:
            return jsonify({'message': 'User created successfully '}), 201
    except Error as e:
        current_app.logger.error(f'Error creating user: {e}')
        return jsonify({'error': 'An error occurred while creating the user'}), 500
    
# Login Route
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()
    login_query = sql.SQL("CALL getLoginDetails(%s, NULL, NULL);")
    cursor.execute(login_query, (email,))
    result = cursor.fetchone()
    password_db_val = result[0]
    user_id_db_val = result[1]
    conn.commit()
    release_db_connection(conn)

    if not email or not password:
        return jsonify({'error': 'Invalid email or password'}), 400
    
    if password_db_val and bcrypt.check_password_hash(password_db_val, password):
        access_token = create_access_token(identity=str(user_id_db_val))
        # Return the JWT token directly in the response
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
