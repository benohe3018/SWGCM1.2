from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError # type: ignore
import hashlib
from ..models import Usuario
from .. import db

usuarios_bp = Blueprint('usuarios', __name__)

def generate_password_hash_sha256(password):
    return hashlib.sha256(password.encode()).hexdigest()

@usuarios_bp.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    print(data)
    try:
        hashed_password = generate_password_hash_sha256(data['contraseña'])
        print("Hash de la contraseña generada:", hashed_password)
        
        new_usuario = Usuario(
            nombre_usuario=data['nombre_usuario'],
            contraseña=hashed_password,
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
            'contraseña': new_usuario.contraseña,
            'rol': new_usuario.rol,
            'nombre_real': new_usuario.nombre_real,
            'apellido_paterno': new_usuario.apellido_paterno,
            'apellido_materno': new_usuario.apellido_materno,
            'matricula': new_usuario.matricula
        }), 201
    except Exception as e:
        db.session.rollback()
        print("Error al crear el usuario:", e)
        return jsonify({"error": str(e)}), 500

@usuarios_bp.route('/usuarios', methods=['GET'])
def read_usuarios():
    try:
        usuarios = Usuario.query.all()
        return jsonify([{
            'id': usuario.id,
            'nombre_usuario': usuario.nombre_usuario,
            'contraseña': usuario.contraseña,
            'rol': usuario.rol,
            'nombre_real': usuario.nombre_real,
            'apellido_paterno': usuario.apellido_paterno,
            'apellido_materno': usuario.apellido_materno,
            'matricula': usuario.matricula
        } for usuario in usuarios]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@usuarios_bp.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    try:
        data = request.get_json()
        usuario = Usuario.query.get_or_404(id)
        usuario.nombre_usuario = data['nombre_usuario']
        usuario.contraseña = generate_password_hash_sha256(data['contraseña'])
        usuario.rol = data['rol']
        usuario.nombre_real = data['nombre_real']
        usuario.apellido_paterno = data['apellido_paterno']
        usuario.apellido_materno = data['apellido_materno']
        usuario.matricula = data['matricula']
        db.session.commit()
        return jsonify(usuario.serialize()), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@usuarios_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    try:
        usuario = Usuario.query.get_or_404(id)
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({'message': 'El usuario ha sido eliminado correctamente.'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@usuarios_bp.route('/usuarios/matricula/<matricula>', methods=['GET'])
def get_usuario_by_matricula(matricula):
    usuario = Usuario.query.filter_by(matricula=matricula).first()
    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify({
        'id': usuario.id,
        'nombre_usuario': usuario.nombre_usuario,
        'contraseña': usuario.contraseña,
        'rol': usuario.rol,
        'nombre_real': usuario.nombre_real,
        'apellido_paterno': usuario.apellido_paterno,
        'apellido_materno': usuario.apellido_materno,
        'matricula': usuario.matricula
    }), 200