import sys
import os
import pytest
from dotenv import load_dotenv

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
