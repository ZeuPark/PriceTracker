# 쿠팡 가격 추적기 (Coupang Price Tracker)

[GitHub 저장소 바로가기](https://github.com/ZeuPark/PriceTracker)

쿠팡 상품의 가격 변동을 추적하는 크롬 확장 프로그램 + FastAPI 백엔드 프로젝트입니다.

---

## 📁 폴더 구조

```
coupang_price_tracer/
├── coupext/                    # 크롬 확장 프로그램
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── icons/
└── coupang_price_api/          # FastAPI 서버
    ├── app/
    │   ├── main.py
    │   └── requirements.txt
    ├── Dockerfile
    └── docker-compose.yml
```

---

## 🚀 빠른 시작

### 1. FastAPI 서버 실행
```bash
cd coupang_price_api/app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 크롬 확장 프로그램 설치
- Chrome에서 `chrome://extensions/` 접속
- "개발자 모드" 활성화
- "압축해제된 확장 프로그램을 로드합니다" 클릭
- `coupext` 폴더 선택

### 3. 사용법
- 쿠팡 상품 페이지 접속
- 확장 프로그램 아이콘 클릭
- 가격 정보와 최근 30일 최저가 비교 확인

---

## 🔄 작동 원리 요약

- **content.js**: 쿠팡 상품 페이지에서 상품명/가격/ID 추출 → FastAPI 서버에 가격 저장
- **popup.js**: 팝업에서 상품 정보 요청 → API로 가격 이력 조회 → 최저가 여부/차액 표시
- **FastAPI 서버**: 가격 저장(/save), 가격 이력 조회(/history/{product_id})
- **DB**: SQLite, 30일 이내 가격만 관리

자세한 원리는 [`쿠팡가격추적기_작동원리.md`](./쿠팡가격추적기_작동원리.md) 참고

---

## 🎨 주요 기능
- 쿠팡 상품 가격 실시간 추적 및 저장
- 최근 30일 최저가 자동 비교
- 첫 방문 시 "첫 번째 가격 기록" 안내
- 가격 변동 시 차액/비율 안내
- 크롬 확장 UI로 직관적 확인

---

## 🔧 기술 스택
- **Frontend**: JavaScript, Chrome Extension API, HTML/CSS
- **Backend**: FastAPI, SQLite, Uvicorn
- **배포**: Docker, Docker Compose

---

## 📦 배포/운영 팁
- 서버 배포 시 `API_BASE`를 서버 주소로 변경 필요
- DB 파일(`*.db`)은 `.gitignore`에 추가 권장
- HTTPS, 인증, 백업 등은 운영 환경에서 추가 적용

---

## 📄 라이선스
MIT 