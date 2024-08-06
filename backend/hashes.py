import os
from argon2 import PasswordHasher
from dotenv import load_dotenv

load_dotenv()

password = "HalaMadrid3018?"

ph = PasswordHasher()
hashed_password = ph.hash(password)

print(f"Contraseña original: {password}")
print(f"Contraseña hasheada: {hashed_password}")

# Verificación
try:
    ph.verify(hashed_password, password)
    print("Verificación exitosa: el hash coincide con la contraseña")
except Exception as e:
    print(f"Error en la verificación: {str(e)}")
