import uvicorn
from app.config import config

if __name__ == '__main__':
    uvicorn.run('app.main:app',
                host=config.BACKEND_HOST,
                port=config.BACKEND_PORT,
                reload=config.BACKEND_RELOAD)

    # Or use terminal command: uvicorn main:app --reload --port 8080
