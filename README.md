# Coupang Price Tracer

쿠팡 상품의 가격 변동을 추적하는 크롬 확장 프로그램과 FastAPI 백엔드입니다.

## 📁 프로젝트 구조

```
coupang_price_tracer/
├── app/                    # FastAPI 백엔드
│   ├── main.py            # API 서버 메인 파일
│   └── requirements.txt   # Python 의존성
├── icons/                 # 확장 프로그램 아이콘
├── content.js             # 크롬 확장 콘텐츠 스크립트
├── popup.html             # 확장 프로그램 팝업
├── popup.js               # 팝업 스크립트
├── manifest.json          # 크롬 확장 매니페스트
├── Dockerfile             # Docker 컨테이너 설정
├── docker-compose.yml     # Docker Compose 설정
└── README.md              # 이 파일
```

## 🚀 빠른 시작

### 1. 로컬 개발 환경

```bash
# FastAPI 서버 실행
cd coupang_price_tracer
docker-compose up -d --build

# 서버가 http://localhost:8000 에서 실행됩니다
```

### 2. 크롬 확장 프로그램 설치

1. Chrome에서 `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `coupang_price_tracer` 폴더 선택

### 3. 사용법

1. 쿠팡 상품 페이지 접속
2. 확장 프로그램 아이콘 클릭
3. 현재 가격과 최근 30일 최저가 비교 확인

## 🌐 서버 배포 (Oracle Free Tier VM)

### 1. 서버 초기 설정

```bash
# Ubuntu 22.04에서
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
# 재로그인 후
```

### 2. 프로젝트 배포

```bash
git clone <your-repo-url>
cd coupang_price_tracer
docker-compose up -d --build
```

### 3. API 설정 변경

서버 배포 후, 크롬 확장 프로그램의 API 주소를 변경하세요:

**content.js**와 **popup.js**에서:
```javascript
// const API_BASE = "http://localhost:8000";  // 개발용
const API_BASE = "http://YOUR_SERVER_IP:8000";  // 서버 배포용
```

## 📡 API 엔드포인트

- `POST /save` - 가격 정보 저장
- `GET /history/{product_id}?days=30` - 가격 이력 조회

## 🔧 개발

### 로컬 개발 서버 실행

```bash
cd app
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Docker 컨테이너 관리

```bash
# 서버 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서버 중지
docker-compose down

# 컨테이너 재빌드
docker-compose up -d --build
```

## 🛡️ 보안 고려사항

- **HTTPS**: Nginx + Let's Encrypt 설정 권장
- **API 인증**: X-API-KEY 헤더 또는 JWT 토큰 추가
- **DB 백업**: `/app/app/data` 볼륨 주기적 스냅샷
- **방화벽**: 8000 포트만 외부 접근 허용

## 📊 데이터베이스

SQLite 데이터베이스가 `app/data/prices.db`에 저장됩니다.
데이터는 Docker 볼륨을 통해 호스트와 공유됩니다.

## 🔄 업데이트

1. 코드 수정 후 `docker-compose up -d --build` 실행
2. 크롬 확장 프로그램은 `chrome://extensions/`에서 새로고침 