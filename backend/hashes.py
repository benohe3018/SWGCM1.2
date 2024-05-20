from werkzeug.security import generate_password_hash, check_password_hash

# Contraseña y hash conocido
password = "HalaMadrid3018?"
stored_hash = "scrypt:32768:8:1$AxPGzhIEBYUIs2zI$2abf5d7097c0cf26113d24d64a3ccfd52f67b0e4206423f57a6b09ca17e8b875baa6a725da07564ebbf7568045eb676fa4aa570ca4fb3824950f37f278bb0d5c"

# Verificar el hash de la contraseña
is_correct = check_password_hash(stored_hash, password)
print("¿La contraseña es correcta?", is_correct)
