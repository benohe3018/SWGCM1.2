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


