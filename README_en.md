# Coupang Price Tracker

[Go to GitHub Repository](https://github.com/ZeuPark/PriceTracker)

A Chrome extension + FastAPI backend project for tracking price changes of Coupang products.

---

## 📁 Project Structure

```
coupang_price_tracer/
├── coupext/                    # Chrome Extension
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── icons/
└── coupang_price_api/          # FastAPI Server
    ├── app/
    │   ├── main.py
    │   └── requirements.txt
    ├── Dockerfile
    └── docker-compose.yml
```

---

## 🚀 Quick Start

### 1. Run FastAPI Server
```bash
cd coupang_price_api/app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Install Chrome Extension
- Go to `chrome://extensions/` in Chrome
- Enable "Developer mode"
- Click "Load unpacked extension"
- Select the `coupext` folder

### 3. How to Use
- Visit a Coupang product page
- Click the extension icon
- Check the price info and 30-day lowest price comparison

---

## 🔄 How It Works (Summary)

- **content.js**: Extracts product name/price/ID from Coupang page → Saves price to FastAPI server
- **popup.js**: Requests product info from content.js → Fetches price history from API → Shows lowest price or difference
- **FastAPI server**: Handles price saving (/save) and price history lookup (/history/{product_id})
- **DB**: SQLite, only keeps last 30 days of data

For full details, see [`쿠팡가격추적기_작동원리.md`](./쿠팡가격추적기_작동원리.md)

---

## 🎨 Main Features
- Real-time price tracking and saving for Coupang products
- Automatic comparison with the lowest price in the last 30 days
- Shows "First price record" on first visit
- Shows difference/percentage if price changes
- Intuitive Chrome extension UI

---

## 🔧 Tech Stack
- **Frontend**: JavaScript, Chrome Extension API, HTML/CSS
- **Backend**: FastAPI, SQLite, Uvicorn
- **Deployment**: Docker, Docker Compose

---

## 📦 Deployment/Operation Tips
- Change `API_BASE` to your server address when deploying
- Add DB files (`*.db`) to `.gitignore`
- For production: set up HTTPS, authentication, backups, etc.

---

## 📄 License
MIT 