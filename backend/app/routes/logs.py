from flask import Blueprint, jsonify
import requests
import os

logs_bp = Blueprint('logs', __name__)

@logs_bp.route('/logs', methods=['GET'])
def get_logs():
  try:
      heroku_app_name = 'swgcm'  # Reemplaza con el nombre de tu aplicación
      heroku_api_key = os.getenv('HEROKU_API_KEY')
      headers = {
          'Authorization': f'Bearer {heroku_api_key}',
          'Accept': 'application/vnd.heroku+json; version=3',
      }
      response = requests.get(f'https://api.heroku.com/apps/{heroku_app_name}/log-sessions', headers=headers)
      if response.status_code == 200:
          log_url = response.json()['logplex_url']
          logs_response = requests.get(log_url)
          return jsonify({'logs': logs_response.text}), 200
      else:
          return jsonify({'error': 'Error al obtener los logs de Heroku'}), response.status_code
  except Exception as e:
      return jsonify({'error': str(e)}), 500