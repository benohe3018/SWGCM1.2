from flask import Blueprint, request, jsonify
from ..models import UnidadesMedicinaFamiliar
from .. import db
import logging
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

unidades_medicas_bp = Blueprint('unidades_medicas', __name__)

@unidades_medicas_bp.route('/unidades_medicina_familiar', methods=['GET'])
def get_unidades():
    try:
        unidades = UnidadesMedicinaFamiliar.query.all()
        return jsonify([{
            'id_unidad_medica': unidad.id,
            'nombre_unidad_medica': unidad.nombre_unidad_medica,
            'direccion_unidad_medica': unidad.direccion_unidad_medica
        } for unidad in unidades]), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar unidades médicas: %s", str(e))
        return jsonify({"error": "Error al recuperar unidades médicas"}), 500

@unidades_medicas_bp.route('/unidades_medicina_familiar', methods=['POST'])
def create_unidad():
    data = request.get_json()
    logging.info("Datos recibidos: %s", data)
    if not all(k in data for k in ('nombre_unidad_medica', 'direccion_unidad_medica')):
        logging.error("Campos faltantes en la solicitud POST: %s", data)
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    try:
        new_unidad = UnidadesMedicinaFamiliar(
            nombre_unidad_medica=data['nombre_unidad_medica'],
            direccion_unidad_medica=data['direccion_unidad_medica']
        )
        db.session.add(new_unidad)
        db.session.commit()
        return jsonify({
            'id_unidad_medica': new_unidad.id,
            'nombre_unidad_medica': new_unidad.nombre_unidad_medica,
            'direccion_unidad_medica': new_unidad.direccion_unidad_medica
        }), 201
    except IntegrityError:
        db.session.rollback()
        logging.error("La unidad médica ya existe: %s", data)
        return jsonify({"error": "La unidad médica ya existe"}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al crear unidad médica: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500

@unidades_medicas_bp.route('/unidades_medicina_familiar/<int:id>', methods=['PUT'])
def update_unidad(id):
    data = request.get_json()
    try:
        unidad = UnidadesMedicinaFamiliar.query.get_or_404(id)
        unidad.nombre_unidad_medica = data.get('nombre_unidad_medica', unidad.nombre_unidad_medica)
        unidad.direccion_unidad_medica = data.get('direccion_unidad_medica', unidad.direccion_unidad_medica)
        db.session.commit()
        return jsonify({
            'id_unidad_medica': unidad.id,
            'nombre_unidad_medica': unidad.nombre_unidad_medica,
            'direccion_unidad_medica': unidad.direccion_unidad_medica
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error al actualizar unidad médica: %s", str(e))
        return jsonify({"error": "Error al actualizar la unidad médica"}), 500

@unidades_medicas_bp.route('/unidades_medicina_familiar/<int:id>', methods=['DELETE'])
def delete_unidad(id):
    try:
        unidad = UnidadesMedicinaFamiliar.query.get_or_404(id)
        db.session.delete(unidad)
        db.session.commit()
        return jsonify({'message': 'La unidad médica ha sido eliminada correctamente.'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error al eliminar unidad médica: %s", str(e))
        return jsonify({"error": "Error al eliminar la unidad médica"}), 500



