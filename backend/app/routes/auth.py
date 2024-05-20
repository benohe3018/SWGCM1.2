from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
import requests
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
db = SQLAlchemy(app)
jwt = JWTManager(app)

api_key = os.getenv('RECAPTCHA_API_KEY')
site_key = os.getenv('RECAPTCHA_SITE_KEY')
project_id = os.getenv('RECAPTCHA_PROJECT_ID')

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(150), unique=True, nullable=False)
    contraseña = db.Column(db.String(150), nullable=False)
    rol = db.Column(db.String(50), nullable=False)
    nombre_real = db.Column(db.String(150), nullable=False)
    apellido_paterno = db.Column(db.String(150), nullable=False)
    apellido_materno = db.Column(db.String(150), nullable=False)
    matricula = db.Column(db.String(12), unique=True, nullable=False)

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

    recaptcha_response = requests.post(f'https://recaptchaenterprise.googleapis.com/v1/projects/{project_id}/assessments?key={api_key}', json={
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

@auth_bp.route('/api/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    contraseña = data.get('contraseña')
    rol = data.get('rol')
    nombre_real = data.get('nombre_real')
    apellido_paterno = data.get('apellido_paterno')
    apellido_materno = data.get('apellido_materno')
    matricula = data.get('matricula')

    hashed_password = generate_password_hash(contraseña)

    new_user = Usuario(
        nombre_usuario=nombre_usuario,
        contraseña=hashed_password,
        rol=rol,
        nombre_real=nombre_real,
        apellido_paterno=apellido_paterno,
        apellido_materno=apellido_materno,
        matricula=matricula
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

