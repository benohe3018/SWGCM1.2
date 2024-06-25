import bcrypt

password = "HalaMadrid3018?"
new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print(f"Nuevo hash generado: {new_hash.decode('utf-8')}")

# Ahora verifica este nuevo hash
result = bcrypt.checkpw(password.encode('utf-8'), new_hash)
print(f"¿La contraseña es correcta con el nuevo hash? {result}")