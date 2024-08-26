import sys
import os
import pytest
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError
from unittest.mock import patch
from sqlalchemy.orm.session import make_transient

# Cargar las variables del archivo .env
load_dotenv()

# Ajustar la ruta de importación
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import Hospital

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app('testing')

    # Crear un contexto de aplicación
    with flask_app.app_context():
        db.create_all()  # Crear tablas
        yield flask_app.test_client()  # Ejecutar las pruebas
        db.drop_all()  # Eliminar tablas

def test_create_hospital(test_client):
    # Prueba con datos válidos
    response = test_client.post('/api/hospitales', json={
        'nombre_hospital': 'Hospital General',
        'ciudad_hospital': 'Ciudad de México'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Hospital creado exitosamente'
    
    # Prueba con datos faltantes
    response = test_client.post('/api/hospitales', json={
        'nombre_hospital': 'Hospital General'
        # falta ciudad_hospital
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data['error'] == 'Nombre y ciudad del hospital son obligatorios'

    # Prueba con datos vacíos
    response = test_client.post('/api/hospitales', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert data['error'] == 'Nombre y ciudad del hospital son obligatorios'

    # Simular un error en la creación del hospital usando patch
    with patch('app.models.db.session.commit', side_effect=SQLAlchemyError("Error en la creación")):
        response = test_client.post('/api/hospitales', json={
            'nombre_hospital': 'Hospital General',
            'ciudad_hospital': 'Ciudad de México'
        })
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
def test_get_hospitales(test_client):
    # Agregar hospitales de prueba
    hospital_1 = Hospital(nombre_hospital="Hospital General", ciudad_hospital="Ciudad de México")
    hospital_2 = Hospital(nombre_hospital="Hospital Regional", ciudad_hospital="Guadalajara")
    db.session.add(hospital_1)
    db.session.add(hospital_2)
    db.session.commit()

    # Prueba de obtención de hospitales
    response = test_client.get('/api/hospitales')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2
    assert data[0]['nombre_hospital'] == "Hospital General"
    assert data[1]['nombre_hospital'] == "Hospital Regional"

    # Simular un error en la consulta usando patch
    with patch('sqlalchemy.orm.query.Query.all', side_effect=SQLAlchemyError("Error en la consulta")):
        response = test_client.get('/api/hospitales')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
def test_update_hospital(test_client):
    # Agregar un hospital de prueba
    hospital = Hospital(nombre_hospital="Hospital General", ciudad_hospital="Ciudad de México")
    db.session.add(hospital)
    db.session.commit()

    # Prueba de actualización de un hospital existente
    response = test_client.put(f'/api/hospitales/{hospital.id}', json={
        'nombre_hospital': 'Hospital Actualizado',
        'ciudad_hospital': 'Monterrey'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Hospital actualizado exitosamente'

    # Verificar que el cambio se guardó en la base de datos
    hospital_actualizado = Hospital.query.get(hospital.id)
    assert hospital_actualizado.nombre_hospital == 'Hospital Actualizado'
    assert hospital_actualizado.ciudad_hospital == 'Monterrey'

    # Prueba de actualización de un hospital inexistente
    response = test_client.put('/api/hospitales/9999', json={
        'nombre_hospital': 'Hospital Fantasma',
        'ciudad_hospital': 'Ciudad Fantasma'
    })
    assert response.status_code == 404
    data = response.get_json()
    assert data['error'] == 'Hospital no encontrado'

    # Simular un error en la actualización usando patch
    with patch('app.models.db.session.commit', side_effect=SQLAlchemyError("Error en la actualización")):
        response = test_client.put(f'/api/hospitales/{hospital.id}', json={
            'nombre_hospital': 'Error en la Actualización',
            'ciudad_hospital': 'Error'
        })
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data

def test_delete_hospital(test_client):
    # Agregar un hospital de prueba
    hospital = Hospital(nombre_hospital="Hospital General", ciudad_hospital="Ciudad de México")
    db.session.add(hospital)
    db.session.commit()

    # Prueba de eliminación exitosa
    response = test_client.delete(f'/api/hospitales/{hospital.id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == "Hospital eliminado exitosamente"

    # Prueba de eliminación de un hospital que no existe
    response = test_client.delete(f'/api/hospitales/{hospital.id}')
    assert response.status_code == 404
    data = response.get_json()
    assert data['error'] == "Hospital no encontrado"

    # Simular un error en la confirmación de la eliminación usando patch
    # Usar make_transient para poder reutilizar el objeto eliminado
    make_transient(hospital)
    db.session.add(hospital)
    db.session.commit()

    with patch('app.models.db.session.commit', side_effect=SQLAlchemyError("Error en la eliminación")):
        response = test_client.delete(f'/api/hospitales/{hospital.id}')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
