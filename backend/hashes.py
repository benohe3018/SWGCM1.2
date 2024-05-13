from werkzeug.security import generate_password_hash

password_hash = generate_password_hash("HalaMadrid3018?")
print(password_hash)

