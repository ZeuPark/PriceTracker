FROM python:3.11-slim

# 타임존(Asia/Seoul) 설정(선택)
ENV TZ=Asia/Seoul

WORKDIR /app
COPY app/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app
WORKDIR /app/app

# 데이터베이스·로그 폴더 마운트 대비
VOLUME ["/app/app/data"]

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"] 