from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
migrate = Migrate()

from .models import *

from .routes.auth import auth_bp
from .routes.medicos import medicos_bp
from .routes.usuarios import usuarios_bp

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:Barc3lona3018?@localhost:5432/swgcm')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Ajusta las CORS según tus necesidades

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(medicos_bp, url_prefix='/api')
    app.register_blueprint(usuarios_bp, url_prefix='/api')

    @app.cli.command("create_db")
    def create_db():
        with app.app_context():
            db.create_all()

    return app

