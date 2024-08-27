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
from app.models import DiagnosticoPresuntivo

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app('testing')

    # Crear un contexto de aplicación
    with flask_app.app_context():
        db.create_all()  # Crear tablas
        yield flask_app.test_client()  # Ejecutar las pruebas
        db.drop_all()  # Eliminar tablas

def test_create_diagnostico(test_client):
    # Prueba con nombre de diagnóstico válido
    response = test_client.post('/api/diagnosticos', json={
        'nombre_diagnostico': 'Hipertensión'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Diagnóstico creado exitosamente'
    
    # Prueba con nombre de diagnóstico vacío
    response = test_client.post('/api/diagnosticos', json={
        'nombre_diagnostico': ''
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Nombre del diagnóstico es obligatorio'

    # Prueba con datos faltantes
    response = test_client.post('/api/diagnosticos', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Nombre del diagnóstico es obligatorio'

    # Simular un error en la base de datos usando patch
    with patch('app.models.db.session.commit', side_effect=SQLAlchemyError("Error en la base de datos")):
        response = test_client.post('/api/diagnosticos', json={
            'nombre_diagnostico': 'Diabetes'
        })
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        
def test_update_diagnostico(test_client):
    # Agregar un diagnóstico de prueba
    diagnostico = DiagnosticoPresuntivo(nombre_diagnostico="Diagnóstico Inicial")
    db.session.add(diagnostico)
    db.session.commit()

    # Prueba de actualización de diagnóstico existente
    response = test_client.put(f'/api/diagnosticos/{diagnostico.id}', json={
        'nombre_diagnostico': 'Diagnóstico Actualizado'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Diagnóstico actualizado exitosamente'

    # Verificar que el cambio se guardó en la base de datos
    diagnostico_actualizado = DiagnosticoPresuntivo.query.get(diagnostico.id)
    assert diagnostico_actualizado.nombre_diagnostico == 'Diagnóstico Actualizado'

    # Prueba de actualización de un diagnóstico inexistente
    response = test_client.put('/api/diagnosticos/9999', json={
        'nombre_diagnostico': 'Diagnóstico No Existente'
    })
    assert response.status_code == 404
    data = response.get_json()
    assert data['error'] == 'Diagnóstico no encontrado'

    # Simular un error en la actualización usando patch
    with patch('app.models.db.session.commit', side_effect=SQLAlchemyError("Error en la actualización")):
        response = test_client.put(f'/api/diagnosticos/{diagnostico.id}', json={
            'nombre_diagnostico': 'Otro Diagnóstico'
        })
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
