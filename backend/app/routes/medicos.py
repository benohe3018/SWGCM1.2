# medicos.py
from flask import Blueprint, request, jsonify
from ..models import Medico
from .. import db
#Nuevas importaciones para implementar el modulo de citas
import logging
from sqlalchemy.exc import SQLAlchemyError

medicos_bp = Blueprint('medicos', __name__)

@medicos_bp.route('/medicos', methods=['POST'])
def create_medico():
    data = request.get_json()
    new_medico = Medico(nombre_medico=data['nombre'], apellido_paterno_medico=data['apellido_paterno'], apellido_materno_medico=data['apellido_materno'], especialidad=data['especialidad'], matricula=data['matricula'])
    db.session.add(new_medico)
    db.session.commit()

    return jsonify(new_medico.to_dict())

@medicos_bp.route('/medicos', methods=['GET'])
def read_medicos():
    medicos = Medico.query.all()
    return jsonify([medico.serialize for medico in medicos])

@medicos_bp.route('/medicos/<int:id>', methods=['GET'])
def read_medico(id):
    medico = Medico.query.get_or_404(id)
    return jsonify(medico.serialize)

@medicos_bp.route('/medicos/<int:id_medico>', methods=['PUT'])
def update_medico(id_medico):
    data = request.get_json()
    medico = Medico.query.get_or_404(id_medico)
    medico.nombre_medico = data['nombre_medico']
    medico.apellido_paterno_medico = data['apellido_paterno_medico']
    medico.apellido_materno_medico = data['apellido_materno_medico']
    medico.especialidad = data['especialidad']
    medico.matricula = data['matricula']
    db.session.commit()
    return jsonify(medico.serialize)

@medicos_bp.route('/medicos/<int:id_medico>', methods=['DELETE'])
def delete_medico(id_medico):
    try:
        medico = Medico.query.get_or_404(id_medico)
        db.session.delete(medico)
        db.session.commit()
        return jsonify({'message': 'El médico ha sido eliminado correctamente.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ha ocurrido un error al intentar eliminar el médico.'}), 500

@medicos_bp.route('/medicos/matricula/<int:matricula>', methods=['GET'])
def get_medico_by_matricula(matricula):
    medico = Medico.query.filter_by(matricula=matricula).first()
    if medico is None:
        return jsonify({}), 404
    return jsonify(medico.serialize), 200

#Nuevo Bloque de Código para implementar el modulo de citas.
@medicos_bp.route('/medicos/list', methods=['GET'])
def list_medicos():
    try:
        medicos = Medico.query.all()
        return jsonify([{
            'id_medico': medico.id_medico,
            'nombre': medico.nombre_medico,
            'apellido_paterno': medico.apellido_paterno_medico,
            'apellido_materno': medico.apellido_materno_medico
        } for medico in medicos]), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar médicos: %s", str(e))
        return jsonify({"error": "Error al recuperar médicos"}), 500