from werkzeug.security import generate_password_hash

password_hash = generate_password_hash("JJesus14")
print(password_hash)

