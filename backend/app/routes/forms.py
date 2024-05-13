# forms.py
from wtforms import Form, StringField, IntegerField, validators

class MedicoForm(Form):
    nombre = StringField('Nombre', [validators.Length(min=1, max=50)])
    apellido_paterno = StringField('Apellido Paterno', [validators.Length(min=1, max=50)])
    apellido_materno = StringField('Apellido Materno', [validators.Length(min=1, max=50)])
    especialidad = StringField('Especialidad', [validators.Length(min=1, max=50)])
    matricula = IntegerField('Matrícula', [validators.NumberRange(min=1, max=999999999999)])

class UsuarioForm(Form):
    nombre_usuario = StringField('Nombre de Usuario', [validators.Length(min=4, max=25)])
    contraseña = StringField('Contraseña', [validators.Length(min=8, max=80)])
    rol = StringField('Rol', [validators.Length(min=1, max=50)])
    nombre_real = StringField('Nombre Real', [validators.Length(min=1, max=50)])
    apellido_paterno = StringField('Apellido Paterno', [validators.Length(min=1, max=50)])
    apellido_materno = StringField('Apellido Materno', [validators.Length(min=1, max=50)])
    matricula = IntegerField('Matrícula', [validators.NumberRange(min=1, max=999999999999)])