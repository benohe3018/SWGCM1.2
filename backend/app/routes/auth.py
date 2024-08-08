import bcrypt
import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
import os
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, HashingError
from models import Usuario, db
from encryption import decrypt_password
from auth_middleware import token_required, role_required
from config import ph, SECRET_KEY, ARGON2_TIME_COST, ARGON2_MEMORY_COST, ARGON2_PARALLELISM
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

auth_bp = Blueprint('auth', __name__)

# Cargar las claves de encriptación desde las variables de entorno
key = os.getenv('SECRET_KEY').encode()
iv = os.getenv('IV_KEY').encode()

def decrypt_password(encrypted_password):
    try:
        encrypted_password_bytes = base64.b64decode(encrypted_password)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted_password = unpad(cipher.decrypt(encrypted_password_bytes), AES.block_size, style='pkcs7')
        return decrypted_password.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error al desencriptar la contraseña: {str(e)}")

def generate_token(identity, role):
    expires = timedelta(hours=24)
    additional_claims = {"role": role}
    return create_access_token(identity=identity, expires_delta=expires, additional_claims=additional_claims)

def hash_password(password):
    try:
        hashed = ph.hash(password)
        return hashed
    except HashingError as e:
        raise ValueError(f"Error al generar el hash de la contraseña: {str(e)}")

def check_password_hash(stored_hash, password):
    try:
        ph.verify(stored_hash, password)
        return True
    except (VerifyMismatchError, ValueError) as e:
        return False

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('nombre_usuario')
    encrypted_password = data.get('password')
    captcha = data.get('captcha')

    recaptcha_response = requests.post(f'https://recaptchaenterprise.googleapis.com/v1/projects/{project_id}/assessments?key={api_key}', json={
        'event': {
            'token': captcha,
            'expectedAction': 'LOGIN',
            'siteKey': site_key,
        }
    })
    recaptcha_data = recaptcha_response.json()

    if 'event' not in recaptcha_data or 'riskAnalysis' not in recaptcha_data:
        return jsonify({"message": "CAPTCHA inválido"}), 401
    if recaptcha_data['event']['expectedAction'] != 'LOGIN' or recaptcha_data['riskAnalysis']['score'] < 0.5:
        return jsonify({"message": "CAPTCHA inválido"}), 401

    try:
        password = decrypt_password(encrypted_password)
    except Exception as e:
        return jsonify({"message": f"Error al desencriptar la contraseña: {str(e)}"}), 500

    try:
        user = Usuario.query.filter_by(nombre_usuario=username).first()
        if user and check_password_hash(user.contrasena, password):
            token = generate_token(user.id, user.rol)
            return jsonify({"message": "Acceso Correcto", "token": token, "role": user.rol}), 200
        else:
            return jsonify({"message": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"message": f"Error durante el proceso de login: {str(e)}"}), 500

@auth_bp.route('/register', methods=['POST'])
@token_required
@role_required(['root'])
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

    return jsonify({"message": "Usuario registrado exitosamente en la base de datos"}), 201

@auth_bp.route('/ruta_protegida', methods=['GET'])
@token_required
@role_required(['Admin', 'root'])
def ruta_protegida():
    return jsonify({"message": "Acceso a ruta protegida concedido"}), 200
