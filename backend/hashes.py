import os
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from argon2 import PasswordHasher
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Claves de encriptación (deben coincidir con las del backend)
key = os.getenv('SECRET_KEY').encode()
iv = os.getenv('IV_KEY').encode()

# Contraseña que quieres encriptar y hashear
password = "HalaMadrid3018?"

# Encriptar con AES-CBC
cipher = AES.new(key, AES.MODE_CBC, iv)
encrypted_password_bytes = cipher.encrypt(pad(password.encode(), AES.block_size))
encrypted_password = base64.b64encode(encrypted_password_bytes).decode()

# Hashear con Argon2
ph = PasswordHasher()
hashed_password = ph.hash(encrypted_password)

print(f"Encrypted Password: {encrypted_password}")
print(f"Hashed Password: {hashed_password}")
