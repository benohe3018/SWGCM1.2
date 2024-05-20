import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
from werkzeug.security import check_password_hash
import os

api_key = os.getenv('RECAPTCHA_API_KEY')
site_key = os.getenv('RECAPTCHA_SITE_KEY')
project_id = os.getenv('RECAPTCHA_PROJECT_ID')
from ..models import Usuario

auth_bp = Blueprint('auth', __name__)

def generate_token(identity, role):
    expires = timedelta(hours=24)
    additional_claims = {"role": role}
    return create_access_token(identity=identity, expires_delta=expires, additional_claims=additional_claims)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Data received:", data)
    username = data.get('nombre_usuario')
    password = data.get('password')
    captcha = data.get('captcha')

    # Verifica el CAPTCHA
    recaptcha_response = requests.post(f'https://recaptchaenterprise.googleapis.com/v1/projects/{project_id}/assessments?key={api_key}', json = {
        'event': {
            'token': captcha,
            'expectedAction': 'LOGIN',
            'siteKey': site_key,
        }
    })
    recaptcha_data = recaptcha_response.json()
    print("reCAPTCHA response:", recaptcha_data)
    if 'event' not in recaptcha_data or 'riskAnalysis' not in recaptcha_data:
        print('Unexpected response from reCAPTCHA Enterprise:', recaptcha_data)
        return jsonify({"message": "Invalid CAPTCHA"}), 401
    if recaptcha_data['event']['expectedAction'] != 'LOGIN' or recaptcha_data['riskAnalysis']['score'] < 0.5:
        return jsonify({"message": "Invalid CAPTCHA"}), 401

    user = Usuario.query.filter_by(nombre_usuario=username).first()
    print("User found:", user)
    if user and check_password_hash(user.contraseña, password):
        token = generate_token(user.id, user.rol)
        return jsonify({"message": "Login successful", "token": token, "role": user.rol}), 200
    print("Invalid credentials for user:", username)
    return jsonify({"message": "Invalid credentials"}), 401

