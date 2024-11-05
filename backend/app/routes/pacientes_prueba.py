from flask import Blueprint, request, jsonify # type: ignore
from ..models import PacientePrueba
from .. import db
from .encryption import encrypt_data, decrypt_data, decrypt_data_old
from datetime import datetime
import os
from sqlalchemy.exc import SQLAlchemyError # type: ignore
import logging

pacientes_prueba_bp = Blueprint('pacientes_prueba', __name__)

@pacientes_prueba_bp.route('/pacientes_prueba', methods=['POST'])
def create_paciente_prueba():
    data = request.get_json()
    required_fields = ['fecha_hora_estudio', 'nss', 'nombre_paciente', 'apellido_paterno_paciente', 'apellido_materno_paciente', 'especialidad_medica', 'nombre_completo_medico', 'estudio_solicitado', 'unidad_medica_procedencia', 'diagnostico_presuntivo', 'hospital_envia']

    for field in required_fields:
        if field not in data:
            logging.error("Campo faltante en la solicitud POST: %s", field)
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

    key = os.getenv('ENCRYPTION_KEY').encode()

    try:
        fecha_hora_estudio = datetime.strptime(data['fecha_hora_estudio'], '%Y-%m-%dT%H:%M')

        # Validar si ya existe una cita en la misma fecha y hora
        existing_cita = PacientePrueba.query.filter_by(fecha_hora_estudio=fecha_hora_estudio).first()
        if existing_cita:
            logging.error("Ya existe una cita en la misma fecha y hora: %s", fecha_hora_estudio)
            return jsonify({"error": "Ya existe una cita en la misma día y hora, modifique el horario/día por favor"}), 400

        encrypted_nss = encrypt_data(data['nss'], key)
        encrypted_nombre_paciente = encrypt_data(data['nombre_paciente'], key)
        encrypted_apellido_paterno_paciente = encrypt_data(data['apellido_paterno_paciente'], key)
        encrypted_apellido_materno_paciente = encrypt_data(data['apellido_materno_paciente'], key)
        encrypted_especialidad_medica = encrypt_data(data['especialidad_medica'], key)
        encrypted_nombre_completo_medico = encrypt_data(data['nombre_completo_medico'], key)
        encrypted_estudio_solicitado = encrypt_data(data['estudio_solicitado'], key)
        encrypted_unidad_medica_procedencia = encrypt_data(data['unidad_medica_procedencia'], key)
        encrypted_diagnostico_presuntivo = encrypt_data(data['diagnostico_presuntivo'], key)

        new_paciente_prueba = PacientePrueba(
            fecha_hora_estudio=fecha_hora_estudio,
            nss=encrypted_nss,
            nombre_paciente=encrypted_nombre_paciente,
            apellido_paterno_paciente=encrypted_apellido_paterno_paciente,
            apellido_materno_paciente=encrypted_apellido_materno_paciente,
            especialidad_medica=encrypted_especialidad_medica,
            nombre_completo_medico=encrypted_nombre_completo_medico,
            estudio_solicitado=encrypted_estudio_solicitado,
            unidad_medica_procedencia=encrypted_unidad_medica_procedencia,
            diagnostico_presuntivo=encrypted_diagnostico_presuntivo,
            hospital_envia=data['hospital_envia']  
        )

        db.session.add(new_paciente_prueba)
        db.session.commit()
        
        logging.info("Paciente prueba creado exitosamente con hospital_envia: %s", data['hospital_envia'])

        return jsonify({"message": "Cita creada exitosamente"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al crear paciente prueba: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500


@pacientes_prueba_bp.route('/pacientes_prueba', methods=['GET'])
def get_pacientes_prueba():
  hospital_envia = request.args.get('hospital_envia')
  key = os.getenv('ENCRYPTION_KEY').encode()
  try:
      query = PacientePrueba.query
      if hospital_envia:
          query = query.filter_by(hospital_envia=hospital_envia)
      
      pacientes_prueba = query.all()
      pacientes_list = []
      for paciente in pacientes_prueba:
          try:
              nombre_completo = f"{decrypt_data(paciente.nombre_paciente, key)} {decrypt_data(paciente.apellido_paterno_paciente, key)} {decrypt_data(paciente.apellido_materno_paciente, key)}"
              pacientes_list.append({
                  'id': paciente.id,
                  'fecha_hora_estudio': paciente.fecha_hora_estudio.strftime('%Y-%m-%dT%H:%M'),
                  'nombre_completo': nombre_completo,
                  'nss': decrypt_data(paciente.nss, key),
                  'especialidad_medica': decrypt_data(paciente.especialidad_medica, key),
                  'nombre_completo_medico': decrypt_data(paciente.nombre_completo_medico, key),
                  'estudio_solicitado': decrypt_data(paciente.estudio_solicitado, key),
                  'unidad_medica_procedencia': decrypt_data(paciente.unidad_medica_procedencia, key),
                  'diagnostico_presuntivo': decrypt_data(paciente.diagnostico_presuntivo, key),
                  'hospital_envia': paciente.hospital_envia  # No desencriptar este campo
              })
          except Exception as e:
              logging.error("Error al descifrar datos para el paciente con ID %s: %s", paciente.id, str(e))
              continue
      return jsonify(pacientes_list), 200
  except SQLAlchemyError as e:
      logging.error("Error al recuperar pacientes de prueba: %s", str(e))
      return jsonify({"error": "Error al recuperar pacientes de prueba"}), 500@pacientes_prueba_bp.route('/pacientes_prueba/<int:id>', methods=['PUT'])
def update_paciente_prueba(id):
    data = request.get_json()
    logging.info(f"Datos recibidos para actualización: {data}")

    required_fields = ['fecha_hora_estudio', 'nss', 'nombre_paciente', 'apellido_paterno_paciente', 'apellido_materno_paciente', 'especialidad_medica', 'nombre_completo_medico', 'estudio_solicitado', 'unidad_medica_procedencia', 'diagnostico_presuntivo', 'hospital_envia']

    for field in required_fields:
        if field not in data:
            logging.error(f"Campo faltante en la solicitud PUT: {field}")
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

    key = os.getenv('ENCRYPTION_KEY').encode()

    try:
        paciente = PacientePrueba.query.get(id)
        if not paciente:
            return jsonify({"error": "Paciente no encontrado"}), 404

        paciente.fecha_hora_estudio = datetime.strptime(data['fecha_hora_estudio'], '%Y-%m-%dT%H:%M')
        paciente.nss = encrypt_data(data['nss'], key)
        paciente.nombre_paciente = encrypt_data(data['nombre_paciente'], key)
        paciente.apellido_paterno_paciente = encrypt_data(data['apellido_paterno_paciente'], key)
        paciente.apellido_materno_paciente = encrypt_data(data['apellido_materno_paciente'], key)
        paciente.especialidad_medica = encrypt_data(data['especialidad_medica'], key)
        paciente.nombre_completo_medico = encrypt_data(data['nombre_completo_medico'], key)
        paciente.estudio_solicitado = encrypt_data(data['estudio_solicitado'], key)
        paciente.unidad_medica_procedencia = encrypt_data(data['unidad_medica_procedencia'], key)
        paciente.diagnostico_presuntivo = encrypt_data(data['diagnostico_presuntivo'], key)
        paciente.hospital_envia = data['hospital_envia']  # No encriptar este campo

        db.session.commit()
        return jsonify({"message": "Paciente actualizado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al actualizar paciente: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500
    except Exception as e:
        logging.error("Error desconocido al actualizar paciente: %s", str(e))
        return jsonify({"error": "Error desconocido"}), 500

@pacientes_prueba_bp.route('/pacientes_prueba/<int:id>', methods=['PUT'])
def update_paciente_prueba(id):
    data = request.get_json()
    logging.info(f"Datos recibidos para actualización: {data}")

    required_fields = ['fecha_hora_estudio', 'nss', 'nombre_paciente', 'apellido_paterno_paciente', 'apellido_materno_paciente', 'especialidad_medica', 'nombre_completo_medico', 'estudio_solicitado', 'unidad_medica_procedencia', 'diagnostico_presuntivo', 'hospital_envia']

    for field in required_fields:
        if field not in data:
            logging.error(f"Campo faltante en la solicitud PUT: {field}")
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

    key = os.getenv('ENCRYPTION_KEY').encode()

    try:
        paciente = PacientePrueba.query.get(id)
        if not paciente:
            return jsonify({"error": "Paciente no encontrado"}), 404

        paciente.fecha_hora_estudio = datetime.strptime(data['fecha_hora_estudio'], '%Y-%m-%dT%H:%M')
        paciente.nss = encrypt_data(data['nss'], key)
        paciente.nombre_paciente = encrypt_data(data['nombre_paciente'], key)
        paciente.apellido_paterno_paciente = encrypt_data(data['apellido_paterno_paciente'], key)
        paciente.apellido_materno_paciente = encrypt_data(data['apellido_materno_paciente'], key)
        paciente.especialidad_medica = encrypt_data(data['especialidad_medica'], key)
        paciente.nombre_completo_medico = encrypt_data(data['nombre_completo_medico'], key)
        paciente.estudio_solicitado = encrypt_data(data['estudio_solicitado'], key)
        paciente.unidad_medica_procedencia = encrypt_data(data['unidad_medica_procedencia'], key)
        paciente.diagnostico_presuntivo = encrypt_data(data['diagnostico_presuntivo'], key)
        paciente.hospital_envia = data['hospital_envia']  # No encriptar este campo

        db.session.commit()
        return jsonify({"message": "Paciente actualizado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al actualizar paciente: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500
    except Exception as e:
        logging.error("Error desconocido al actualizar paciente: %s", str(e))
        return jsonify({"error": "Error desconocido"}), 500

@pacientes_prueba_bp.route('/pacientes_prueba/<int:id>', methods=['DELETE'])
def delete_paciente_prueba(id):
    print(f"Recibida solicitud DELETE para paciente con ID: {id}")
    try:
        paciente = PacientePrueba.query.get(id)
        if not paciente:
            print(f"Paciente con ID {id} no encontrado")
            return jsonify({"error": "Paciente no encontrado"}), 404
        
        print(f"Eliminando paciente con ID: {id}")
        db.session.delete(paciente)
        db.session.commit()
        print(f"Paciente con ID {id} eliminado exitosamente")
        return jsonify({"message": "Paciente eliminado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        error_msg = f"Error en la base de datos al eliminar paciente: {str(e)}"
        print(error_msg)
        logging.error(error_msg)
        return jsonify({"error": "Error en la base de datos"}), 500
    
@pacientes_prueba_bp.route('/pacientes_prueba/restore', methods=['POST'])
def restore_citas():
  try:
      citas = request.get_json()
      key_str = os.getenv('ENCRYPTION_KEY')
      if not key_str:
          logging.error("ENCRYPTION_KEY no está definida.")
          return jsonify({'error': 'Clave de encriptación no definida en el servidor.'}), 500
      key = key_str.encode()

      for cita_data in citas:
          # Validar campos requeridos
          required_fields = ['id', 'fecha_hora_estudio', 'nss', 'especialidad_medica', 'nombre_completo_medico',
                             'estudio_solicitado', 'unidad_medica_procedencia', 'diagnostico_presuntivo',
                             'hospital_envia']
          missing_fields = [field for field in required_fields if field not in cita_data or not cita_data[field]]
          if missing_fields:
              logging.error(f"Faltan campos requeridos en cita_data: {missing_fields}")
              return jsonify({'error': f"Faltan campos requeridos en los datos de la cita: {', '.join(missing_fields)}"}), 400

          # Descomponer nombre completo si los campos individuales no están presentes
          if not all(field in cita_data for field in ['nombre_paciente', 'apellido_paterno_paciente', 'apellido_materno_paciente']):
              if 'nombre_completo' in cita_data and cita_data['nombre_completo']:
                  nombre_paciente, apellido_paterno_paciente, apellido_materno_paciente = descomponer_nombre_completo(cita_data['nombre_completo'])
              else:
                  logging.error("Falta 'nombre_completo' para descomponer nombre y apellidos.")
                  return jsonify({'error': "Falta 'nombre_completo' para descomponer nombre y apellidos."}), 400
          else:
              nombre_paciente = cita_data['nombre_paciente']
              apellido_paterno_paciente = cita_data['apellido_paterno_paciente']
              apellido_materno_paciente = cita_data['apellido_materno_paciente']

          # Parsear la fecha
          try:
              fecha_hora_estudio = datetime.strptime(cita_data['fecha_hora_estudio'], '%Y-%m-%dT%H:%M')
          except ValueError as ve:
              logging.error(f"Error al parsear la fecha en cita_data['fecha_hora_estudio']: {str(ve)}")
              return jsonify({'error': f"Formato de fecha incorrecto en 'fecha_hora_estudio': {cita_data['fecha_hora_estudio']}"}), 400

          # Procesar cita
          try:
              existing_cita = PacientePrueba.query.filter_by(id=cita_data['id']).first()

              if existing_cita:
                  # Actualizar campos de la cita existente
                  existing_cita.fecha_hora_estudio = fecha_hora_estudio
                  existing_cita.nss = encrypt_data(cita_data['nss'], key)
                  existing_cita.nombre_paciente = encrypt_data(nombre_paciente, key)
                  existing_cita.apellido_paterno_paciente = encrypt_data(apellido_paterno_paciente, key)
                  existing_cita.apellido_materno_paciente = encrypt_data(apellido_materno_paciente, key)
                  existing_cita.especialidad_medica = encrypt_data(cita_data['especialidad_medica'], key)
                  existing_cita.nombre_completo_medico = encrypt_data(cita_data['nombre_completo_medico'], key)
                  existing_cita.estudio_solicitado = encrypt_data(cita_data['estudio_solicitado'], key)
                  existing_cita.unidad_medica_procedencia = encrypt_data(cita_data['unidad_medica_procedencia'], key)
                  existing_cita.diagnostico_presuntivo = encrypt_data(cita_data['diagnostico_presuntivo'], key)
                  existing_cita.hospital_envia = cita_data['hospital_envia']
              else:
                  # Crear una nueva cita
                  nueva_cita = PacientePrueba(
                      fecha_hora_estudio=fecha_hora_estudio,
                      nss=encrypt_data(cita_data['nss'], key),
                      nombre_paciente=encrypt_data(nombre_paciente, key),
                      apellido_paterno_paciente=encrypt_data(apellido_paterno_paciente, key),
                      apellido_materno_paciente=encrypt_data(apellido_materno_paciente, key),
                      especialidad_medica=encrypt_data(cita_data['especialidad_medica'], key),
                      nombre_completo_medico=encrypt_data(cita_data['nombre_completo_medico'], key),
                      estudio_solicitado=encrypt_data(cita_data['estudio_solicitado'], key),
                      unidad_medica_procedencia=encrypt_data(cita_data['unidad_medica_procedencia'], key),
                      diagnostico_presuntivo=encrypt_data(cita_data['diagnostico_presuntivo'], key),
                      hospital_envia=cita_data['hospital_envia']
                  )
                  db.session.add(nueva_cita)

          except Exception as e:
              logging.error(f"Error al procesar cita con ID {cita_data['id']}: {str(e)}")
              return jsonify({'error': f"Error al procesar la cita con ID {cita_data['id']}: {str(e)}"}), 500

      db.session.commit()
      return jsonify({'message': 'Citas restauradas con éxito.'}), 200

  except Exception as e:
      db.session.rollback()
      logging.error(f'Error general al restaurar las citas: {str(e)}')
      return jsonify({'error': f'Error al restaurar las citas: {str(e)}'}), 500
  

@pacientes_prueba_bp.route('/pacientes_prueba', methods=['GET'])
def get_citas():
    try:
        # Recupera todas las citas de la base de datos
        citas = PacientePrueba.query.all()
        key_str = os.getenv('ENCRYPTION_KEY')
        if not key_str:
            logging.error("ENCRYPTION_KEY no está definida.")
            return jsonify({'error': 'Clave de encriptación no definida en el servidor.'}), 500
        key = key_str.encode()

        # Prepara la lista de citas a devolver, desencriptando los datos necesarios
        citas_list = []
        for cita in citas:
            citas_list.append({
                'id': cita.id,
                'fecha_hora_estudio': cita.fecha_hora_estudio.strftime('%Y-%m-%dT%H:%M'),
                'nss': decrypt_data(cita.nss, key),
                'nombre_paciente': decrypt_data(cita.nombre_paciente, key),
                'apellido_paterno_paciente': decrypt_data(cita.apellido_paterno_paciente, key),
                'apellido_materno_paciente': decrypt_data(cita.apellido_materno_paciente, key),
                'especialidad_medica': decrypt_data(cita.especialidad_medica, key),
                'nombre_completo_medico': decrypt_data(cita.nombre_completo_medico, key),
                'estudio_solicitado': decrypt_data(cita.estudio_solicitado, key),
                'unidad_medica_procedencia': decrypt_data(cita.unidad_medica_procedencia, key),
                'diagnostico_presuntivo': decrypt_data(cita.diagnostico_presuntivo, key),
                'hospital_envia': cita.hospital_envia
            })

        return jsonify(citas_list), 200
    except Exception as e:
        logging.error(f'Error al recuperar las citas: {str(e)}')
        return jsonify({'error': f'Error al recuperar las citas: {str(e)}'}), 500

  
def descomponer_nombre_completo(nombre_completo):
  partes = nombre_completo.strip().split()
  if len(partes) >= 3:
      # Últimas dos partes son los apellidos
      apellido_paterno_paciente = partes[-2]
      apellido_materno_paciente = partes[-1]
      # El resto son los nombres
      nombre_paciente = ' '.join(partes[:-2])
  else:
      # Si hay menos de 3 partes, asumimos una estructura básica
      nombre_paciente = partes[0] if len(partes) > 0 else ''
      apellido_paterno_paciente = partes[1] if len(partes) > 1 else ''
      apellido_materno_paciente = ''
  return nombre_paciente, apellido_paterno_paciente, apellido_materno_paciente







