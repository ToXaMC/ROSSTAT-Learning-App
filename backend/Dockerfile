FROM tiangolo/uvicorn-gunicorn-fastapi:latest

WORKDIR /app/

RUN apt-get update && apt-get install -y libgl1-mesa-dev

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app/app

CMD ["python", "runserver.py"]