from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, LargeBinary
from . import db
from .routes.encryption import encrypt_data, decrypt_data, decrypt_data_old
import os

db = SQLAlchemy()
Base = declarative_base()

class Medico(db.Model):
    __tablename__ = 'medicos'
    id_medico = db.Column(db.Integer, primary_key=True)
    nombre_medico = db.Column(db.String(100), nullable=False)
    apellido_paterno_medico = db.Column(db.String(50), nullable=False)
    apellido_materno_medico = db.Column(db.String(50), nullable=False)
    especialidad = db.Column(db.String(50), nullable=False)
    matricula = db.Column(db.Integer, nullable=False)
    citas_refiere = db.relationship('Cita', backref='medico_refiere', lazy=True, foreign_keys='Cita.id_medico_refiere')
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

     
    @property
    def serialize(self):
        return {
            'id_medico': self.id_medico,
            'nombre_medico': self.nombre_medico,
            'apellido_paterno_medico': self.apellido_paterno_medico,
            'apellido_materno_medico': self.apellido_materno_medico,
            'especialidad': self.especialidad,
            'matricula': self.matricula,            
        }

class UnidadesMedicinaFamiliar(db.Model):
    __tablename__ = 'unidades_medicina_familiar'
    id = db.Column(db.Integer, primary_key=True)
    nombre_unidad_medica = db.Column(db.String(100), nullable=False)
    direccion_unidad_medica = db.Column(db.String(255), nullable=False)
    citas = db.relationship('Cita', backref='unidad_medica_origen', lazy=True)

class Hospital(db.Model):
    __tablename__ = 'hospitales'
    id = db.Column(db.Integer, primary_key=True)
    nombre_hospital = db.Column(db.String(100), nullable=False)
    ciudad_hospital = db.Column(db.String(50), nullable=False)
    citas = db.relationship('Cita', backref='hospital_origen', lazy=True)

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    NSS = db.Column(db.String(20), primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido_paterno = db.Column(db.String(50), nullable=False)
    apellido_materno = db.Column(db.String(50), nullable=False)
    direccion = db.Column(db.String(100), nullable=True)
    telefono = db.Column(db.String(10), nullable=True)
    sexo = db.Column(db.String(1), nullable=False)
    peso = db.Column(db.Float, nullable=False)
    citas = db.relationship('Cita', backref='paciente', lazy=True)

class EstudiosRadiologicos(db.Model):
    __tablename__ = 'estudiosradiologicos'
    id_estudio = db.Column(db.Integer, primary_key=True)
    nombre_estudio = db.Column(db.String(100), nullable=False)
    descripcion_estudio = db.Column(db.String(255), nullable=False)
    citas = db.relationship('Cita', backref='estudio_radiologico', lazy=True)

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(50), nullable=False)
    contrasena = db.Column(db.String(128), nullable=False)
    def set_password(self, password):
        self.contraseña = generate_password_hash(password)
    matricula = db.Column(db.BigInteger, unique=True, nullable=False)
    rol = db.Column(db.String(50), nullable=False)
    nombre_real = db.Column(db.String(50), nullable=False)
    apellido_paterno = db.Column(db.String(50), nullable=False)
    apellido_materno = db.Column(db.String(50), nullable=False)
    citas_registra = db.relationship('Cita', backref='usuario_registra', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'nombre_usuario': self.nombre_usuario,
            'contraseña': self.contraseña,
            'rol': self.rol,
            'nombre_real': self.nombre_real,
            'apellido_paterno': self.apellido_paterno,
            'apellido_materno': self.apellido_materno,
            'matricula': self.matricula
        }

class Cita(db.Model):
    __tablename__ = 'citas'
    id_cita = db.Column(db.Integer, primary_key=True)
    fecha_hora_cita = db.Column(db.DateTime, nullable=False)
    nss_paciente = db.Column(db.String(20), db.ForeignKey('pacientes.NSS'), nullable=False)
    id_medico_refiere = db.Column(db.Integer, db.ForeignKey('medicos.id_medico'))
    id_estudio_radiologico = db.Column(db.Integer, db.ForeignKey('estudiosradiologicos.id_estudio'))
    id_usuario_registra = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    id_unidad_medica_origen = db.Column(db.Integer, db.ForeignKey('unidades_medicina_familiar.id'))
    id_hospital_origen = db.Column(db.Integer, db.ForeignKey('hospitales.id'))
    id_operador = db.Column(db.Integer, db.ForeignKey('operador.id'))
    

class Informe(db.Model):
    __tablename__ = 'informes'
    id = db.Column(db.Integer, primary_key=True)
    id_cita = db.Column(db.Integer, db.ForeignKey('citas.id_cita'), nullable=False)
    contenido = db.Column(db.Text)
    fecha_creacion = db.Column(db.DateTime, default=db.func.current_timestamp())
    cita = db.relationship('Cita', backref='informes', lazy=True)

class Operador(db.Model):
    __tablename__ = 'operador'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido_paterno = db.Column(db.String(50), nullable=False)
    apellido_materno = db.Column(db.String(50), nullable=False)
    numero_telefonico = db.Column(db.String(20), nullable=True)
    citas = db.relationship('Cita', backref='operador', lazy=True)
    
class PacientePrueba(db.Model):  
    __tablename__ = 'pacientes_prueba'
    
    id = db.Column(db.Integer, primary_key=True)
    fecha_hora_estudio = db.Column(db.DateTime, nullable=False)
    nss = db.Column(db.LargeBinary, nullable=False)
    nombre_paciente = db.Column(db.LargeBinary, nullable=False)
    apellido_paterno_paciente = db.Column(db.LargeBinary, nullable=False)
    apellido_materno_paciente = db.Column(db.LargeBinary, nullable=False)
    especialidad_medica = db.Column(db.LargeBinary, nullable=False)
    nombre_completo_medico = db.Column(db.LargeBinary, nullable=False)
    estudio_solicitado = db.Column(db.LargeBinary, nullable=False)
    unidad_medica_procedencia = db.Column(db.LargeBinary, nullable=False)
    diagnostico_presuntivo = db.Column(db.LargeBinary, nullable=False)

    def __init__(self, fecha_hora_estudio, nss, nombre_paciente, apellido_paterno_paciente, apellido_materno_paciente,
                 especialidad_medica, nombre_completo_medico, estudio_solicitado, 
                 unidad_medica_procedencia, diagnostico_presuntivo):
        self.fecha_hora_estudio = fecha_hora_estudio
        self.nss = nss
        self.nombre_paciente = nombre_paciente
        self.apellido_paterno_paciente = apellido_paterno_paciente
        self.apellido_materno_paciente = apellido_materno_paciente
        self.especialidad_medica = especialidad_medica
        self.nombre_completo_medico = nombre_completo_medico
        self.estudio_solicitado = estudio_solicitado
        self.unidad_medica_procedencia = unidad_medica_procedencia
        self.diagnostico_presuntivo = diagnostico_presuntivo

def update_user_password_in_db(user_id, new_encrypted_password):
    user = Usuario.query.get(user_id)
    user.contrasena = new_encrypted_password
    db.session.commit()

class EspecialidadesMedicas(db.Model):
    __tablename__ = 'especialidades_medicas'
    id = db.Column(db.Integer, primary_key=True)
    nombre_especialidad = db.Column(db.String(100), unique=True, nullable=False)

class DiagnosticoPresuntivo(db.Model):
    __tablename__ = 'diagnostico_presuntivo'
    id = db.Column(db.Integer, primary_key=True)
    nombre_diagnostico = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre_diagnostico': self.nombre_diagnostico
        }

    









