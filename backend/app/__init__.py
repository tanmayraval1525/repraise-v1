from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth


bcrypt = Bcrypt()
jwt = JWTManager()
oauth = OAuth()
def create_app():

    load_dotenv()
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True,methods=["GET", "POST", "OPTIONS","PUT","DELETE"])


    bcrypt.init_app(app)
    jwt.init_app(app)
    oauth.init_app(app)

    from app.routes import main
    app.register_blueprint(main)

    from app.dashboard import dashboard
    app.register_blueprint(dashboard,url_prefix="/home")

    from app.googleAuth import auth
    app.register_blueprint(auth, url_prefix="/auth")

    from app.food import food
    app.register_blueprint(food,url_prefix="/home")

    from app.profile import profile
    app.register_blueprint(profile,url_prefix="/profile")

    return app
