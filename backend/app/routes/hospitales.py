from flask import Blueprint, request, jsonify
from ..models import Hospital
from .. import db
import logging
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

hospitales_bp = Blueprint('hospitales', __name__)

@hospitales_bp.route('/hospitales', methods=['GET'])
def get_hospitales():
    try:
        hospitales = Hospital.query.all()
        return jsonify([{
            'id_hospital': hospital.id,
            'nombre_hospital': hospital.nombre_hospital,
            'ciudad_hospital': hospital.ciudad_hospital
        } for hospital in hospitales]), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar hospitales: %s", str(e))
        return jsonify({"error": "Error al recuperar hospitales"}), 500

@hospitales_bp.route('/hospitales', methods=['POST'])
def create_hospital():
    data = request.get_json()
    logging.info("Datos recibidos: %s", data)
    if not all(k in data for k in ('nombre_hospital', 'ciudad_hospital')):
        logging.error("Campos faltantes en la solicitud POST: %s", data)
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    try:
        new_hospital = Hospital(
            nombre_hospital=data['nombre_hospital'],
            ciudad_hospital=data['ciudad_hospital']
        )
        db.session.add(new_hospital)
        db.session.commit()
        return jsonify({
            'id_hospital': new_hospital.id,
            'nombre_hospital': new_hospital.nombre_hospital,
            'ciudad_hospital': new_hospital.ciudad_hospital
        }), 201
    except IntegrityError:
        db.session.rollback()
        logging.error("El hospital ya existe: %s", data)
        return jsonify({"error": "El hospital ya existe"}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al crear hospital: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500

@hospitales_bp.route('/hospitales/<int:id>', methods=['PUT'])
def update_hospital(id):
    data = request.get_json()
    try:
        hospital = Hospital.query.get_or_404(id)
        hospital.nombre_hospital = data.get('nombre_hospital', hospital.nombre_hospital)
        hospital.ciudad_hospital = data.get('ciudad_hospital', hospital.ciudad_hospital)
        db.session.commit()
        return jsonify({
            'id_hospital': hospital.id,
            'nombre_hospital': hospital.nombre_hospital,
            'ciudad_hospital': hospital.ciudad_hospital
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error al actualizar hospital: %s", str(e))
        return jsonify({"error": "Error al actualizar el hospital"}), 500

@hospitales_bp.route('/hospitales/<int:id>', methods=['DELETE'])
def delete_hospital(id):
    try:
        hospital = Hospital.query.get_or_404(id)
        db.session.delete(hospital)
        db.session.commit()
        return jsonify({'message': 'El hospital ha sido eliminado correctamente.'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error al eliminar hospital: %s", str(e))
        return jsonify({"error": "Error al eliminar el hospital"}), 500

# Nuevo endpoint para listar hospitales
