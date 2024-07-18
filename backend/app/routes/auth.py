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
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

# Obtención de variables de entorno para reCAPTCHA
api_key = os.getenv('RECAPTCHA_API_KEY')
site_key = os.getenv('RECAPTCHA_SITE_KEY')
project_id = os.getenv('RECAPTCHA_PROJECT_ID')

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
        print(f"Error al desencriptar la contraseña: {str(e)}")
        raise

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
    except (VerifyMismatchError, ValueError) as e:
        print(f"Error al verificar el hash de la contraseña: {str(e)}")
        return False

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('nombre_usuario')
    encrypted_password = data.get('password')
    captcha = data.get('captcha')

    print("Datos recibidos del frontend")
    print(f"Usuario: {username}")
    print(f"Contraseña cifrada: {encrypted_password}")
    print(f"Captcha: {captcha}")

    # Verifica el CAPTCHA
    recaptcha_response = requests.post(f'https://recaptchaenterprise.googleapis.com/v1/projects/{project_id}/assessments?key={api_key}', json={
        'event': {
            'token': captcha,
            'expectedAction': 'LOGIN',
            'siteKey': site_key,
        }
    })
    recaptcha_data = recaptcha_response.json()
    print("Respuesta de reCAPTCHA:", recaptcha_data)

    if 'event' not in recaptcha_data or 'riskAnalysis' not in recaptcha_data:
        return jsonify({"message": "Invalid CAPTCHA"}), 401
    if recaptcha_data['event']['expectedAction'] != 'LOGIN' or recaptcha_data['riskAnalysis']['score'] < 0.5:
        return jsonify({"message": "Invalid CAPTCHA"}), 401

    print(f"Intento de login para usuario: {username}")

    try:
        password = decrypt_password(encrypted_password)
        print(f"Contraseña desencriptada: {password}")
    except Exception as e:
        print(f"Error al desencriptar la contraseña: {str(e)}")
        return jsonify({"message": "Error al desencriptar la contraseña"}), 500

    try:
        user = Usuario.query.filter_by(nombre_usuario=username).first()
        print(f"Usuario encontrado en la base de datos: {user is not None}")
        if user and check_password_hash(user.contrasena, password):
            if user.contrasena.startswith('$2b$'):  # Es un hash bcrypt, actualizar a Argon2
                new_hash = hash_password(password)
                user.contrasena = new_hash
                db.session.commit()
            token = generate_token(user.id, user.rol)
            print(f"Token generado: {token}")
            return jsonify({"message": "Acceso Correcto", "token": token, "role": user.rol}), 200
        else:
            print("Credenciales inválidas")
            return jsonify({"message": "Credenciales inválidas"}), 401
    except Exception as e:
        print(f"Error durante el proceso de login: {str(e)}")
        return jsonify({"message": "Error durante el proceso de login"}), 500

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

    return jsonify({"message": "Usuario registrado exitosamente en la base de datos"}), 201

