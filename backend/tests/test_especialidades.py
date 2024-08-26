import sys
import os
import pytest
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError
from unittest.mock import patch

# Cargar las variables del archivo .env
load_dotenv()

# Ajustar la ruta de importación
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import EspecialidadesMedicas

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app('testing')

    # Crear un contexto de aplicación
    with flask_app.app_context():
        db.create_all()  # Crear tablas
        yield flask_app.test_client()  # Ejecutar las pruebas
        db.drop_all()  # Eliminar tablas

def test_create_especialidad(test_client):
    # Prueba con nombre de especialidad válido
    response = test_client.post('/api/especialidades', json={
        'nombre_especialidad': 'Cardiología'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Especialidad creada exitosamente'
    
    # Prueba con nombre de especialidad vacío
    response = test_client.post('/api/especialidades', json={
        'nombre_especialidad': ''
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

    # Prueba con datos faltantes
    response = test_client.post('/api/especialidades', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert data['error'] == 'El nombre de la especialidad es obligatorio'

def test_get_especialidades(test_client):
    # Agregar especialidades de prueba
    especialidad_1 = EspecialidadesMedicas(nombre_especialidad="Cardiología")
    especialidad_2 = EspecialidadesMedicas(nombre_especialidad="Neurología")
    db.session.add(especialidad_1)
    db.session.add(especialidad_2)
    db.session.commit()

    # Prueba de obtención de especialidades
    response = test_client.get('/api/especialidades/list')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2
    assert data[0]['nombre_especialidad'] == "Cardiología"
    assert data[1]['nombre_especialidad'] == "Neurología"

    # Simular un error en la consulta usando patch
    with patch('sqlalchemy.orm.query.Query.all', side_effect=SQLAlchemyError("Error en la consulta")):
        print("Patching successful, simulating error...")
        response = test_client.get('/api/especialidades/list')
        assert response.status_code == 500
        
def test_update_especialidad(test_client):
    # Agregar una especialidad de prueba
    especialidad = EspecialidadesMedicas(nombre_especialidad="Cardiología")
    db.session.add(especialidad)
    db.session.commit()

    # Prueba de actualización de especialidad existente
    response = test_client.put(f'/api/especialidades/{especialidad.id}', json={
        'nombre_especialidad': 'Neurología'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Especialidad actualizada exitosamente'

    # Verificar que el cambio se guardó en la base de datos
    especialidad_actualizada = EspecialidadesMedicas.query.get(especialidad.id)
    assert especialidad_actualizada.nombre_especialidad == 'Neurología'

    # Prueba de actualización de una especialidad inexistente
    response = test_client.put('/api/especialidades/9999', json={
        'nombre_especialidad': 'Oncología'
    })
    assert response.status_code == 404
    data = response.get_json()
    assert data['error'] == 'Especialidad no encontrada'

    # Simular un error en la actualización usando patch
    with patch('app.models.db.session.commit', side_effect=SQLAlchemyError("Error en la actualización")):
        response = test_client.put(f'/api/especialidades/{especialidad.id}', json={
            'nombre_especialidad': 'Ginecología'
        })
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        
def test_delete_especialidad(test_client):
    # Agregar una especialidad de prueba
    especialidad = EspecialidadesMedicas(nombre_especialidad="Cardiología")
    db.session.add(especialidad)
    db.session.commit()

    # Prueba de eliminación exitosa
    response = test_client.delete(f'/api/especialidades/{especialidad.id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == "Especialidad eliminada exitosamente"

    # Prueba de eliminación de una especialidad que no existe
    response = test_client.delete(f'/api/especialidades/{especialidad.id}')
    assert response.status_code == 404
    data = response.get_json()
    assert data['error'] == "Especialidad no encontrada"

    # Crear una nueva instancia de especialidad para simular la eliminación fallida
    nueva_especialidad = EspecialidadesMedicas(nombre_especialidad="Cardiología")
    db.session.add(nueva_especialidad)
    db.session.commit()

    # Simular un error en la confirmación de la eliminación usando patch
    with patch('app.models.db.session.commit', side_effect=SQLAlchemyError("Error en la eliminación")):
        response = test_client.delete(f'/api/especialidades/{nueva_especialidad.id}')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data




  