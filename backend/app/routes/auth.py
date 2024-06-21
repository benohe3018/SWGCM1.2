import bcrypt
import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token # type: ignore
from datetime import timedelta
import os
from ..models import Usuario, db

api_key = os.getenv('RECAPTCHA_API_KEY')
site_key = os.getenv('RECAPTCHA_SITE_KEY')
project_id = os.getenv('RECAPTCHA_PROJECT_ID')

auth_bp = Blueprint('auth', __name__)

def generate_token(identity, role):
    expires = timedelta(hours=24)
    additional_claims = {"role": role}
    return create_access_token(identity=identity, expires_delta=expires, additional_claims=additional_claims)

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password_hash(stored_hash, password):
    return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('nombre_usuario')
    password = data.get('password')
    captcha = data.get('captcha')

    print(f"Nombre de usuario recibido: {username}")
    print(f"Tipo de contraseña recibida: {type(password)}")

    # Verifica el CAPTCHA
    recaptcha_response = requests.post(f'https://recaptchaenterprise.googleapis.com/v1/projects/{project_id}/assessments?key={api_key}', json={
        'event': {
            'token': captcha,
            'expectedAction': 'LOGIN',
            'siteKey': site_key,
        }
    })
    recaptcha_data = recaptcha_response.json()
    if 'event' not in recaptcha_data or 'riskAnalysis' not in recaptcha_data:
        return jsonify({"message": "Invalid CAPTCHA"}), 401
    if recaptcha_data['event']['expectedAction'] != 'LOGIN' or recaptcha_data['riskAnalysis']['score'] < 0.5:
        return jsonify({"message": "Invalid CAPTCHA"}), 401

    user = Usuario.query.filter_by(nombre_usuario=username).first()
    if user and user.contrasena.startswith('$2b$'):  # Verifica que sea un hash bcrypt
        print(f"Usuario encontrado: {user.nombre_usuario}")
        print(f"Tipo de hash almacenado: {type(user.contrasena)}")
        
        if check_password_hash(user.contrasena, password):
            token = generate_token(user.id, user.rol)
            return jsonify({"message": "Acceso Correcto", "token": token, "role": user.rol}), 200
        else:
            print("Verificación de contraseña fallida")

    return jsonify({"message": "Credenciales inválidas"}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('nombre_usuario')
    password = data.get('password')
    role = data.get('rol')
    nombre_real = data.get('nombre_real')
    apellido_paterno = data.get('apellido_paterno')
    apellido_materno = data.get('apellido_materno')
    matricula = data.get('matricula')
    
    if Usuario.query.filter_by(nombre_usuario=username).first():
        return jsonify({"message": "El nombre de usuario ya existe"}), 400
    
    hashed_password = hash_password(password)
    
    new_user = Usuario(
        nombre_usuario=username, 
        contrasena=hashed_password,
        rol=role,
        nombre_real=nombre_real,
        apellido_paterno=apellido_paterno,
        apellido_materno=apellido_materno,
        matricula=matricula
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Usuario registrado exitosamente"}), 201