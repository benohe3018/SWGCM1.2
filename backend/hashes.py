import hashlib

def generate_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

password = "54809c4da78ea1744818c5ba68779456dcb6bd3e2470e6ab7c28b4bb849f4d6f0bb7f995c214b2deab30039af53770139943eaa6e9d0ee21eeeff06c0b01b227"
hash = generate_password_hash(password)
print(f"Hash generado: {hash}")
   