FROM python:3.10-slim
WORKDIR /app
COPY . /app
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
EXPOSE 8000 9000
CMD ["bash","-c","python telegram_service.py & python execute_service.py & python strategy_engine.py"]
