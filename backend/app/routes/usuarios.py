import bcrypt
from flask import Blueprint, request, jsonify
from ..models import Usuario
from .. import db
from sqlalchemy.exc import SQLAlchemyError # type: ignore

usuarios_bp = Blueprint('usuarios', __name__)

def generate_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

@usuarios_bp.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()  # Obtiene los datos de la solicitud
    print(data)  # Imprime los datos recibidos en la solicitud
    try:
        # Genera el hash de la contraseña
        hashed_password = generate_password_hash(data['contrasena'])
        
        new_usuario = Usuario(
            nombre_usuario=data['nombre_usuario'],
            contrasena=hashed_password,  # Almacena el hash en lugar de la contraseña en texto plano
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
            'contraseña': new_usuario.contrasena,
            'rol': new_usuario.rol,
            'nombre_real': new_usuario.nombre_real,
            'apellido_paterno': new_usuario.apellido_paterno,
            'apellido_materno': new_usuario.apellido_materno,
            'matricula': new_usuario.matricula
        }), 201
    except Exception as e:  # Captura cualquier excepción
        db.session.rollback()
        print("Error al crear el usuario:", e)  # Agrega un log para el error
        return jsonify({"error": str(e)}), 500

@usuarios_bp.route('/usuarios', methods=['GET'])
def read_usuarios():
    try:
        usuarios = Usuario.query.all()
        return jsonify([{
            'id': usuario.id,
            'nombre_usuario': usuario.nombre_usuario,
            'contraseña': usuario.contrasena,
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
        usuario.contrasena = generate_password_hash(data['contraseña'])  # Genera el hash de la nueva contraseña
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
        'contraseña': usuario.contrasena,
        'rol': usuario.rol,
        'nombre_real': usuario.nombre_real,
        'apellido_paterno': usuario.apellido_paterno,
        'apellido_materno': usuario.apellido_materno,
        'matricula': usuario.matricula
    }), 200