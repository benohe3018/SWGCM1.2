from flask import Blueprint, jsonify, current_app
import requests
import os

logs_bp = Blueprint('logs', __name__)

@logs_bp.route('/logs', methods=['GET'])
def get_logs():
    try:
        heroku_app_name = 'swgcm'  # Reemplaza con el nombre de tu aplicación
        heroku_api_key = os.getenv('HEROKU_API_KEY')
        if not heroku_api_key:
            return jsonify({'error': 'HEROKU_API_KEY no está definido'}), 500

        headers = {
            'Authorization': f'Bearer {heroku_api_key}',
            'Accept': 'application/vnd.heroku+json; version=3',
            'Content-Type': 'application/json'
        }
        response = requests.post(
            f'https://api.heroku.com/apps/{heroku_app_name}/log-sessions',
            headers=headers,
            json={"source": "app", "tail": False}
        )
        if response.status_code != 201:
            return jsonify({
                'error': 'Error al obtener los logs de Heroku',
                'status_code': response.status_code,
                'response': response.text
            }), response.status_code

        log_url = response.json().get('logplex_url')
        if not log_url:
            return jsonify({'error': 'No se encontró la URL de logplex en la respuesta de Heroku'}), 500

        logs_response = requests.get(log_url)
        if logs_response.status_code != 200:
            return jsonify({
                'error': 'Error al acceder a los logs de Heroku',
                'status_code': logs_response.status_code,
                'response': logs_response.text
            }), logs_response.status_code

        return jsonify({'logs': logs_response.text}), 200
    except Exception as e:
        current_app.logger.error(f'Error al obtener los logs: {str(e)}')
        return jsonify({'error': str(e)}), 500
