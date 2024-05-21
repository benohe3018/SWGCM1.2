import hashlib

def generate_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

password = "LuisUno46"
hash = generate_password_hash(password)
print(f"Hash generado: {hash}")
   