from functools import wraps
from flask import request, jsonify
import jwt
from models import Usuario
from config import SECRET_KEY

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = Usuario.query.filter_by(id=data['user_id']).first()
            if current_user is None:
                raise ValueError('User not found')
        except Exception as e:
            return jsonify({'message': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def role_required(roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            current_user = kwargs.get('current_user', None)
            if current_user and current_user.rol not in roles:
                return jsonify({'message': 'You do not have access to this resource'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
