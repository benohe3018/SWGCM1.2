import bcrypt
import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
import os
from argon2.exceptions import VerifyMismatchError
from .config import ph
from ..models import Usuario, db
from argon2.exceptions import HashingError

api_key = os.getenv('RECAPTCHA_API_KEY')
site_key = os.getenv('RECAPTCHA_SITE_KEY')
project_id = os.getenv('RECAPTCHA_PROJECT_ID')

auth_bp = Blueprint('auth', __name__)

def generate_token(identity, role):
    expires = timedelta(hours=24)
    additional_claims = {"role": role}
    return create_access_token(identity=identity, expires_delta=expires, additional_claims=additional_claims)

def hash_password(password):
    try:
        return ph.hash(password)
    except HashingError as e:
        print(f"Error al generar el hash de la contraseña: {str(e)}")
        raise ValueError("Error al procesar la contraseña")

def check_password_hash(stored_hash, password):
    try:
        if stored_hash.startswith('$2b$'):  # Es un hash bcrypt
            return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
        else:  # Es un hash Argon2
            return ph.verify(stored_hash, password)
    except (VerifyMismatchError, ValueError):
        return False

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('nombre_usuario')
    password = data.get('password')
    captcha = data.get('captcha')

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
    
    print(f"Intento de login para usuario: {username}")

    user = Usuario.query.filter_by(nombre_usuario=username).first()
    if user and check_password_hash(user.contrasena, password):
        if user.contrasena.startswith('$2b$'):  # Es un hash bcrypt, actualizar a Argon2
            new_hash = hash_password(password)
            user.contrasena = new_hash
            db.session.commit()
        token = generate_token(user.id, user.rol)
        return jsonify({"message": "Acceso Correcto", "token": token, "role": user.rol}), 200
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