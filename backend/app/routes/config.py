from dotenv import load_dotenv
import os
from argon2 import PasswordHasher

load_dotenv()  # Carga las variables de entorno desde el archivo .env

SECRET_KEY = os.getenv('SECRET_KEY')
IV_KEY = os.getenv('IV_KEY')

ARGON2_TIME_COST = 5
ARGON2_MEMORY_COST = 102400
ARGON2_PARALLELISM = 8

ph = PasswordHasher(
    time_cost=ARGON2_TIME_COST,
    memory_cost=ARGON2_MEMORY_COST,
    parallelism=ARGON2_PARALLELISM
)
