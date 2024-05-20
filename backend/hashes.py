from werkzeug.security import generate_password_hash

password_hash = generate_password_hash("B3n0tt0")
print(password_hash)

