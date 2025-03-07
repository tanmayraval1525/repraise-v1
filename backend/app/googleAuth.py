import datetime
from flask import Flask, redirect, url_for, session, jsonify, make_response
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
from app import oauth
from psycopg2 import sql, Error
from flask import Blueprint
from flask_jwt_extended import create_access_token
from app.db import get_db_connection, release_db_connection
from psycopg2.extras import RealDictCursor

# OAuth setup
load_dotenv()

auth = Blueprint('auth', __name__)

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url="https://oauth2.googleapis.com/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    client_kwargs={"scope": "email profile"},
    redirect_uri="http://localhost:5000/auth/callback",
)

# Login route
@auth.route("/login")
def login():
    redirect_uri = url_for("auth.auth_callback", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

# Callback route
@auth.route("/callback")
def auth_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = oauth.google.get("userinfo").json()

        email = user_info.get("email", "")
        fname = user_info.get("given_name", "")
        lname = user_info.get("family_name", "")
        picture = user_info.get("picture", "")
        name = user_info.get("name", "")

        # Check if the user exists in the database or register
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        check_query = sql.SQL("CALL googleUserCheck(%s, %s, %s, %s, NULL);")
        cursor.execute(check_query, (email, fname, lname, picture))
        user_row = cursor.fetchone()  # Fetch the row
        user_id = user_row.get("p_user_id") if user_row else None
        conn.commit()
        release_db_connection(conn)

        if not user_id:
            return jsonify({"error": "User not found in the database"}), 401

        # Generate JWT token with user ID as identity
        access_token = create_access_token(
            identity=str(user_id),  # Using user ID as the identity
            additional_claims={"name": name, "picture": picture},
            expires_delta=datetime.timedelta(days=1)  # Token expires in 1 day
        )

        # Redirect to the frontend with the JWT token as a query parameter
        frontend_url = f"http://localhost:3000/googleAuth?access_token={access_token}"
        return redirect(frontend_url)

    except Exception as e:
        return jsonify({"error": "Authentication failed", "message": str(e)}), 400

# User info route (requires authentication)
@auth.route("/user")
def get_user():
    user = session.get("user")
    if user:
        return jsonify(user)
    return jsonify({"error": "Not logged in"}), 401

# Logout route
@auth.route("/logout")
def logout():
    session.pop("user", None)
    return redirect("http://localhost:3000")  # Adjust the URL for frontend logout redirection
