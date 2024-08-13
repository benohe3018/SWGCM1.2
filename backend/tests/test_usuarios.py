import sys
import os
import pytest
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

# Ajustar la ruta de importación
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import Usuario

# Importar las rutas del blueprint de usuarios
from app.routes.usuarios import generate_password_hash, create_usuario, read_usuarios, update_usuario, delete_usuario, get_usuario_by_matricula

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()

    # Crear un contexto de aplicación
    with flask_app.app_context():
        db.create_all()  # Crear tablas
        yield flask_app.test_client()  # Ejecutar las pruebas
        db.drop_all()  # Eliminar tablas

def test_create_usuario(test_client):
    response = test_client.post('/api/usuarios', json={
        'nombre_usuario': 'testuser',
        'contraseña': 'testpassword',
        'rol': 'admin',
        'nombre_real': 'Test',
        'apellido_paterno': 'User',
        'apellido_materno': 'Example',
        'matricula': '12345678'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['nombre_usuario'] == 'testuser'
    assert data['rol'] == 'admin'

def test_read_usuarios(test_client):
    response = test_client.get('/api/usuarios')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0  # Verifica que hay al menos un usuario

def test_update_usuario(test_client):
    # Crear un usuario primero
    response = test_client.post('/api/usuarios', json={
        'nombre_usuario': 'updatetestuser',
        'contraseña': 'testpassword',
        'rol': 'admin',
        'nombre_real': 'Update',
        'apellido_paterno': 'Test',
        'apellido_materno': 'User',
        'matricula': '87654321'
    })
    data = response.get_json()
    user_id = data['id']

    # Actualizar el usuario
    response = test_client.put(f'/api/usuarios/{user_id}', json={
        'nombre_usuario': 'updateduser',
        'rol': 'user'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['nombre_usuario'] == 'updateduser'
    assert data['rol'] == 'user'

def test_delete_usuario(test_client):
    # Crear un usuario primero
    response = test_client.post('/api/usuarios', json={
        'nombre_usuario': 'deletetestuser',
        'contraseña': 'testpassword',
        'rol': 'admin',
        'nombre_real': 'Delete',
        'apellido_paterno': 'Test',
        'apellido_materno': 'User',
        'matricula': '11223344'
    })
    data = response.get_json()
    user_id = data['id']

    # Eliminar el usuario
    response = test_client.delete(f'/api/usuarios/{user_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'El usuario ha sido eliminado correctamente.'

def test_get_usuario_by_matricula(test_client):
    # Crear un usuario primero
    response = test_client.post('/api/usuarios', json={
        'nombre_usuario': 'matriculatestuser',
        'contraseña': 'testpassword',
        'rol': 'admin',
        'nombre_real': 'Matricula',
        'apellido_paterno': 'Test',
        'apellido_materno': 'User',
        'matricula': '55667788'
    })
    response = test_client.get('/api/usuarios/matricula/55667788')
    assert response.status_code == 200
    data = response.get_json()
    assert data['nombre_usuario'] == 'matriculatestuser'
