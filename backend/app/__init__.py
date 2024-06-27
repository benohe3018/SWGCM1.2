from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
migrate = Migrate()

# Importa todos los modelos
from .models import *

# Importa e inicializa los blueprints
from .routes.auth import auth_bp
from .routes.medicos import medicos_bp
from .routes.usuarios import usuarios_bp

def create_app():
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
    
    # Configuración mejorada de la base de datos
    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:Barc3lona3018?@localhost:5432/swgcm')
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Ajusta las CORS según tus necesidades

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(medicos_bp, url_prefix='/api')
    app.register_blueprint(usuarios_bp, url_prefix='/api')

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app


