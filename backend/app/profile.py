import os
from flask import request, jsonify, Blueprint, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from psycopg2 import sql, Error
from app.db import get_db_connection, release_db_connection
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create a Blueprint for user profile management
profile = Blueprint('profile', __name__)

# Route to fetch user profile
@profile.route('/user_profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = int(get_jwt_identity())
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("CALL get_user_body_measure(%s,NULL,NULL,NULL,NULL);", (user_id,))
        result = cursor.fetchone()
        release_db_connection(conn)
        
        
        return jsonify({
            
            "height": str(result[0]) if result[0] else "",
            "weight": str(result[1]) if result[1] else "",
            "age": str(result[2]) if result[2] else "",
            "goal": str(result[3]) if result[3] else [""]
            
        }), 200
        
    
    except Error as e:
        current_app.logger.error(f'Error retrieving user profile: {e}')
        return jsonify({'error': 'An error occurred while fetching user profile'}), 500

# Route to add a new user profile
# @profile.route('/user_profile', methods=['POST'])
# # @jwt_required()
# def add_user_profile():
#     user_id = int(get_jwt_identity())
#     data = request.get_json()
#     height = data.get('height')
#     weight = data.get('weight') 
#     age = data.get('age') 
#     goal = data.get('goal') 
    
#     if not all([height, weight, age, goal]):
#         return jsonify({'error': 'All fields (height, weight, age, goal) are required'}), 400
    
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor()
#         insert_query = sql.SQL("CALL insert_user_profile(%s, %s, %s, %s, %s);")
#         cursor.execute(insert_query, (user_id, height, weight, age, goal))
#         conn.commit()
#         release_db_connection(conn)
        
#         return jsonify({'message': 'User profile added successfully'}), 201
    
#     except Error as e:
#         current_app.logger.error(f'Error adding user profile: {e}')
#         return jsonify({'error': 'An error occurred while adding the user profile'}), 500

# Route to upsert user profile
@profile.route('/user_profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    height = data.get('height')
    weight = data.get('weight')
    age = data.get('age')
    goal = data.get('goal')
    
    if not all([height, weight, age, goal]):
        return jsonify({'error': 'All fields (height, weight, age, goal) are required'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        update_query = sql.SQL("CALL upsert_user_body_measures(%s, %s, %s, %s, %s);")
        cursor.execute(update_query, (user_id, height, weight, age, goal))
        conn.commit()
        release_db_connection(conn)
        
        return jsonify({'message': 'User profile updated successfully'}), 200
    
    except Error as e:
        current_app.logger.error(f'Error updating user profile: {e}')
        return jsonify({'error': 'An error occurred while updating the user profile'}), 500

# Route to delete a user profile
@profile.route('/user_profile', methods=['DELETE'])
# @jwt_required()
def delete_user_profile():
    user_id = int(get_jwt_identity())
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        delete_query = sql.SQL("CALL delete_user_profile(%s);")
        cursor.execute(delete_query, (user_id,))
        conn.commit()
        release_db_connection(conn)
        
        return jsonify({'message': 'User profile deleted successfully'}), 200
    
    except Error as e:
        current_app.logger.error(f'Error deleting user profile: {e}')
        return jsonify({'error': 'An error occurred while deleting the user profile'}), 500



@profile.route('/get_profile_picture', methods=['GET'])
@jwt_required()
def get_profile_picture():
    user_id = int(get_jwt_identity())  # Get user_id from query parameters


    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        get_query = sql.SQL("CALL getProfilePictureURL(%s,NULL,NULL);")
        # Call the stored procedure
        cursor.execute(get_query, (user_id,))
        result = cursor.fetchone()

        if result:
            full_name = result[0]
            profile_picture_url = result[1] if result[1] else ""  
            return jsonify({"profile_picture_url": profile_picture_url  ,"full_name":full_name}), 200
        else:
            return jsonify({"error": "Profile picture not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            conn.close()

