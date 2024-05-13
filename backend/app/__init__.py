from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS  # Importa CORS
from flask_jwt_extended import JWTManager


# Inicializa las extensiones pero aún sin ninguna app vinculada
db = SQLAlchemy()
migrate = Migrate()

# Importa todos los modelos
from .models import * 

from .routes.auth import auth_bp
from .routes.medicos import medicos_bp
from .routes.usuarios import usuarios_bp

def create_app():
    # Crea una instancia de la aplicación Flask
    app = Flask(__name__)

    # Configuración básica de la aplicación
    app.config['SECRET_KEY'] = 'Barcelona3018?'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Barc3lona3018?@localhost:5432/swgcm'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializa las extensiones con la aplicación Flask
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)  # Inicializa JWTManager con la aplicación Flask
    
    # Configura CORS para permitir solicitudes desde el dominio del frontend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # Registro de blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(medicos_bp, url_prefix='/api')
    app.register_blueprint(usuarios_bp, url_prefix='/api') 

    @app.cli.command("create_db")
    def create_db():
        with app.app_context():
            db.create_all()
               
    
    return app

