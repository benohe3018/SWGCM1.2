import requests
import hashlib
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token # type: ignore
from datetime import timedelta
import os
from ..models import Usuario

api_key = os.getenv('RECAPTCHA_API_KEY')
site_key = os.getenv('RECAPTCHA_SITE_KEY')
project_id = os.getenv('RECAPTCHA_PROJECT_ID')

auth_bp = Blueprint('auth', __name__)

def generate_token(identity, role):
    expires = timedelta(hours=24)
    additional_claims = {"role": role}
    return create_access_token(identity=identity, expires_delta=expires, additional_claims=additional_claims)

def check_password_hash(stored_hash, password):
    return stored_hash == hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Datos recibidos para el login:", data)
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
    print("Respuesta de reCAPTCHA:", recaptcha_data)
    if 'event' not in recaptcha_data or 'riskAnalysis' not in recaptcha_data:
        print('Respuesta inesperada de reCAPTCHA Enterprise:', recaptcha_data)
        return jsonify({"message": "Invalid CAPTCHA"}), 401
    if recaptcha_data['event']['expectedAction'] != 'LOGIN' or recaptcha_data['riskAnalysis']['score'] < 0.5:
        return jsonify({"message": "Invalid CAPTCHA"}), 401

    user = Usuario.query.filter_by(nombre_usuario=username).first()
    print("Usuario encontrado:", user)
    if user:
        print("Contraseña en texto plano:", password)
        print("Contraseña almacenada (hash):", user.contraseña)
        is_password_correct = check_password_hash(user.contraseña, password)
        print("¿La contraseña es correcta?", is_password_correct)
        if is_password_correct:
            print("Contraseña verificada correctamente para el usuario:", username)
            token = generate_token(user.id, user.rol)
            return jsonify({"message": "Login successful", "token": token, "role": user.rol}), 200
        else:
            print("Las credenciales no son válidas para el usuario:", username)
    else:
        print("Usuario no encontrado:", username)
    return jsonify({"message": "Invalid credentials"}), 401