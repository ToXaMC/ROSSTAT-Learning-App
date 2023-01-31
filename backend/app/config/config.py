import os
from dotenv import load_dotenv

load_dotenv(os.path.abspath(__file__ + '/../../../../.env'))

# Debug
DEBUG = True if os.getenv('DEBUG') == 'True' else False

# Backend
BACKEND_HOST = os.getenv('BACKEND_HOST')
BACKEND_PORT = int(os.getenv('BACKEND_PORT'))
BACKEND_RELOAD = True if os.getenv('BACKEND_RELOAD') == 'True' else False

# JWT
BACKEND_JWT_SECRET = os.getenv('BACKEND_JWT_SECRET')
BACKEND_JWT_ALGORITHM = os.getenv('BACKEND_JWT_ALGORITHM')
BACKEND_JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('BACKEND_JWT_ACCESS_TOKEN_EXPIRE_MINUTES'))

# PostgreSQL
POSTGRES_SERVER = os.getenv('POSTGRES_SERVER')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')

SQLALCHEMY_DATABASE_URI = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}'
