from flask import Blueprint, request, jsonify
from ..models import Usuario
from .. import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from argon2 import PasswordHasher
from argon2.exceptions import HashingError

usuarios_bp = Blueprint('usuarios', __name__)
ph = PasswordHasher()

def generate_password_hash(password):
    try:
        return ph.hash(password)
    except HashingError as e:
        raise ValueError(f"Error al generar el hash de la contraseña: {str(e)}")

@usuarios_bp.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    required_fields = ['nombre_usuario', 'contraseña', 'rol', 'nombre_real', 'apellido_paterno', 'apellido_materno', 'matricula']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    try:
        hashed_password = generate_password_hash(data['contraseña'])
        
        new_usuario = Usuario(
            nombre_usuario=data['nombre_usuario'],
            contrasena=hashed_password,  # Note el uso de 'contrasena' aquí
            rol=data['rol'],
            nombre_real=data['nombre_real'],
            apellido_paterno=data['apellido_paterno'],
            apellido_materno=data['apellido_materno'],
            matricula=data['matricula']
        )
        db.session.add(new_usuario)
        db.session.commit()
        return jsonify({
            'id': new_usuario.id,
            'nombre_usuario': new_usuario.nombre_usuario,
            'rol': new_usuario.rol,
            'nombre_real': new_usuario.nombre_real,
            'apellido_paterno': new_usuario.apellido_paterno,
            'apellido_materno': new_usuario.apellido_materno,
            'matricula': new_usuario.matricula
        }), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El nombre de usuario o la matrícula ya existen"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error en la base de datos"}), 500

@usuarios_bp.route('/usuarios', methods=['GET'])
def read_usuarios():
    try:
        usuarios = Usuario.query.all()
        return jsonify([{
            'id': usuario.id,
            'nombre_usuario': usuario.nombre_usuario,
            'rol': usuario.rol,
            'nombre_real': usuario.nombre_real,
            'apellido_paterno': usuario.apellido_paterno,
            'apellido_materno': usuario.apellido_materno,
            'matricula': usuario.matricula
        } for usuario in usuarios if usuario]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Error al recuperar usuarios"}), 500

@usuarios_bp.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    try:
        data = request.get_json()
        usuario = Usuario.query.get_or_404(id)
        usuario.nombre_usuario = data.get('nombre_usuario', usuario.nombre_usuario)
        if 'contraseña' in data:
            usuario.contrasena = generate_password_hash(data['contraseña'])
        usuario.rol = data.get('rol', usuario.rol)
        usuario.nombre_real = data.get('nombre_real', usuario.nombre_real)
        usuario.apellido_paterno = data.get('apellido_paterno', usuario.apellido_paterno)
        usuario.apellido_materno = data.get('apellido_materno', usuario.apellido_materno)
        usuario.matricula = data.get('matricula', usuario.matricula)
        db.session.commit()
        return jsonify({
            'id': usuario.id,
            'nombre_usuario': usuario.nombre_usuario,
            'rol': usuario.rol,
            'nombre_real': usuario.nombre_real,
            'apellido_paterno': usuario.apellido_paterno,
            'apellido_materno': usuario.apellido_materno,
            'matricula': usuario.matricula
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar el usuario"}), 500

@usuarios_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    try:
        usuario = Usuario.query.get_or_404(id)
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({'message': 'El usuario ha sido eliminado correctamente.'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar el usuario"}), 500

@usuarios_bp.route('/usuarios/matricula/<matricula>', methods=['GET'])
def get_usuario_by_matricula(matricula):
    usuario = Usuario.query.filter_by(matricula=matricula).first()
    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify({
        'id': usuario.id,
        'nombre_usuario': usuario.nombre_usuario,
        'rol': usuario.rol,
        'nombre_real': usuario.nombre_real,
        'apellido_paterno': usuario.apellido_paterno,
        'apellido_materno': usuario.apellido_materno,
        'matricula': usuario.matricula
    }), 200