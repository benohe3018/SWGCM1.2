import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
from werkzeug.security import check_password_hash, generate_password_hash
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

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Datos recibidos para el login:", data)  # Agrega un log para ver los datos recibidos
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
    print("Respuesta de reCAPTCHA:", recaptcha_data)  # Agrega un log para ver la respuesta de reCAPTCHA
    if 'event' not in recaptcha_data or 'riskAnalysis' not in recaptcha_data:
        print('Respuesta inesperada de reCAPTCHA Enterprise:', recaptcha_data)
        return jsonify({"message": "Invalid CAPTCHA"}), 401
    if recaptcha_data['event']['expectedAction'] != 'LOGIN' or recaptcha_data['riskAnalysis']['score'] < 0.5:
        return jsonify({"message": "Invalid CAPTCHA"}), 401

    user = Usuario.query.filter_by(nombre_usuario=username).first()
    print("Usuario encontrado:", user)  # Agrega un log para ver el usuario encontrado
    if user:
        print("Contraseña en texto plano:", password)  # Agrega un log para ver la contraseña en texto plano
        print("Contraseña almacenada (hash):", user.contraseña)  # Agrega un log para ver el hash almacenado
        if check_password_hash(user.contraseña, password):
            print("Contraseña verificada correctamente para el usuario:", username)
            token = generate_token(user.id, user.rol)
            return jsonify({"message": "Login successful", "token": token, "role": user.rol}), 200
        else:
            print("Las credenciales no son válidas para el usuario:", username)  # Agrega un log para credenciales no válidas
    else:
        print("Usuario no encontrado:", username)  # Agrega un log para usuario no encontrado
    return jsonify({"message": "Invalid credentials"}), 401

