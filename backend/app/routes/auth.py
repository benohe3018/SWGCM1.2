from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, HashingError
from ..models import Usuario, db
from .encryption import decrypt_data as decrypt_password
from .auth_middleware import token_required, role_required
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64
import os

# Creación del blueprint de autenticación
auth_bp = Blueprint('auth', __name__)

# Cargar las claves de encriptación desde las variables de entorno
key = os.getenv('SECRET_KEY').encode()
iv = os.getenv('IV_KEY').encode()

# Función para desencriptar la contraseña
def decrypt_password(encrypted_password):
    try:
        encrypted_password_bytes = base64.b64decode(encrypted_password)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted_password = unpad(cipher.decrypt(encrypted_password_bytes), AES.block_size, style='pkcs7')
        return decrypted_password.decode('utf-8')
    except Exception as e:
        raise Exception(f"Error al desencriptar la contraseña: {str(e)}")

# Función para generar el token JWT
def generate_token(identity, role):
    expires = timedelta(hours=24)
    additional_claims = {"role": role}
    return create_access_token(identity=identity, expires_delta=expires, additional_claims=additional_claims)

# Función para hashear la contraseña usando Argon2
ph = PasswordHasher()
def check_password_hash(stored_hash, password):
    try:
        ph.verify(stored_hash, password)
        return True
    except (VerifyMismatchError, ValueError):
        return False

# Ruta para el login de usuarios
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('nombre_usuario')
    encrypted_password = data.get('password')

    # Intento de login
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
