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

 # Importa e inicializa los blueprints desde un archivo x la base de datos
from .routes.auth import auth_bp
from .routes.medicos import medicos_bp
from .routes.usuarios import usuarios_bp
from .routes.estudios import estudios_bp
from .routes.citas import citas_bp
from .routes.unidades_medicas import unidades_medicas_bp  # Nuevo import
from .routes.hospitales import hospitales_bp  # Nuevo import

def create_app():
    relative_static_folder_path = '../../frontend/build'
    app = Flask(__name__, static_folder=relative_static_folder_path, static_url_path='')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
    # Asegúrate de que la URL de la base de datos comienza con 'postgresql://'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:Barc3lona3018?@localhost:5432/swgcm').replace("postgres://", "postgresql://")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    CORS(app, resources={r"/api/*": {"origins": "*"}})  

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(medicos_bp, url_prefix='/api')
    app.register_blueprint(usuarios_bp, url_prefix='/api')
    app.register_blueprint(estudios_bp, url_prefix='/api')
    app.register_blueprint(citas_bp, url_prefix='/api')
    app.register_blueprint(unidades_medicas_bp, url_prefix='/api')  # Registro nuevo
    app.register_blueprint(hospitales_bp, url_prefix='/api')  # Registro nuevo

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

