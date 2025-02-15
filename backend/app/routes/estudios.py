from flask import Blueprint, request, jsonify
from ..models import EstudiosRadiologicos
from .. import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import logging

estudios_bp = Blueprint('estudios', __name__)

@estudios_bp.route('/estudios', methods=['GET'])
def get_estudios():
    try:
        estudios = EstudiosRadiologicos.query.all()
        return jsonify([{
            'id_estudio': estudio.id_estudio,
            'nombre_estudio': estudio.nombre_estudio,
            'descripcion_estudio': estudio.descripcion_estudio
        } for estudio in estudios]), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar estudios: %s", str(e))
        return jsonify({"error": "Error al recuperar estudios"}), 500

@estudios_bp.route('/estudios', methods=['POST'])
def create_estudio():
    data = request.get_json()
    logging.info("Datos recibidos: %s", data)
    if not all(k in data for k in ('nombre_estudio', 'descripcion_estudio')):
        logging.error("Campos faltantes en la solicitud POST: %s", data)
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    try:
        new_estudio = EstudiosRadiologicos(
            nombre_estudio=data['nombre_estudio'],
            descripcion_estudio=data['descripcion_estudio']
        )
        db.session.add(new_estudio)
        db.session.commit()
        return jsonify({
            'id_estudio': new_estudio.id_estudio,
            'nombre_estudio': new_estudio.nombre_estudio,
            'descripcion_estudio': new_estudio.descripcion_estudio
        }), 201
    except IntegrityError:
        db.session.rollback()
        logging.error("El estudio ya existe: %s", data)
        return jsonify({"error": "El estudio ya existe"}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al crear estudio: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500


@estudios_bp.route('/estudios/<int:id>', methods=['PUT'])
def update_estudio(id):
    data = request.get_json()
    try:
        estudio = EstudiosRadiologicos.query.get_or_404(id)
        estudio.nombre_estudio = data.get('nombre_estudio', estudio.nombre_estudio)
        estudio.descripcion_estudio = data.get('descripcion_estudio', estudio.descripcion_estudio)
        db.session.commit()
        return jsonify({
            'id_estudio': estudio.id_estudio,
            'nombre_estudio': estudio.nombre_estudio,
            'descripcion_estudio': estudio.descripcion_estudio
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error al actualizar estudio: %s", str(e))
        return jsonify({"error": "Error al actualizar el estudio"}), 500

@estudios_bp.route('/estudios/<int:id>', methods=['DELETE'])
def delete_estudio(id):
    try:
        estudio = EstudiosRadiologicos.query.get_or_404(id)
        db.session.delete(estudio)
        db.session.commit()
        return jsonify({'message': 'El estudio ha sido eliminado correctamente.'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error al eliminar estudio: %s", str(e))
        return jsonify({"error": "Error al eliminar el estudio"}), 500

# Nuevo endpoint para listar estudios radiológicos
@estudios_bp.route('/estudios/list', methods=['GET'])
def list_estudios():
    try:
        estudios = EstudiosRadiologicos.query.all()
        return jsonify([{
            'id_estudio': estudio.id_estudio,
            'nombre_estudio': estudio.nombre_estudio
        } for estudio in estudios]), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar estudios: %s", str(e))
        return jsonify({"error": "Error al recuperar estudios"}), 500
    
@estudios_bp.route('/estudios/restore', methods=['POST'])
def restore_estudios():
  try:
      estudios = request.get_json()
      for estudio_data in estudios:
          existing_estudio = EstudiosRadiologicos.query.filter_by(id_estudio=estudio_data['id_estudio']).first()
          if existing_estudio:
              existing_estudio.nombre_estudio = estudio_data['nombre_estudio']
              existing_estudio.descripcion_estudio = estudio_data['descripcion_estudio']
          else:
              new_estudio = EstudiosRadiologicos(
                  nombre_estudio=estudio_data['nombre_estudio'],
                  descripcion_estudio=estudio_data['descripcion_estudio']
              )
              db.session.add(new_estudio)
      db.session.commit()
      return jsonify({'message': 'Datos restaurados con éxito.'}), 200
  except Exception as e:
      logging.error("Error al restaurar los datos: %s", str(e))
      return jsonify({'error': 'Error al restaurar los datos.'}), 500

