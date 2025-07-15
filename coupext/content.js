(() => {
  // API 서버 설정 - 서버 배포 시 이 부분을 수정하세요
  const API_BASE = "http://127.0.0.1:8000";  // 개발용
  // const API_BASE = "http://123.456.78.90:8000";  // 서버 배포 시 사용

  // 상품 정보 추출 함수
  function extractProductInfo() {
    // 상품 ID를 URL에서 추출 (여러 방법 시도)
    let productId = new URL(window.location.href).searchParams.get("vendorItemId");
    if (!productId) {
      productId = new URL(window.location.href).searchParams.get("productId");
    }
    if (!productId) {
      productId = window.location.pathname.split('/').pop();
    }
    if (!productId) {
      productId = window.location.href.split('/').pop().split('?')[0];
    }

    // 제목 추출 (쿠팡 실제 구조에 맞게)
    let titleEl = document.querySelector('span.twc-font-bold');
    if (!titleEl) titleEl = document.querySelector('h1.product-title span');
    if (!titleEl) titleEl = document.querySelector('h1.product-title');
    if (!titleEl) titleEl = document.querySelector('.product-title');
    if (!titleEl) titleEl = document.querySelector('h1');

    // 가격 추출 (쿠팡 실제 구조에 맞게)
    let priceEl = null;
    const priceSelectors = [
      'div.price-amount.final-price-amount',
      'div.price-amount.sales-price-amount',
      '.price-amount',
      '.sales-price-amount',
      '[class*="price"]',
      '[class*="Price"]',
      '.total-price',
      '.product-price',
      '.price'
    ];
    
    for (const selector of priceSelectors) {
      priceEl = document.querySelector(selector);
      if (priceEl && priceEl.innerText.trim()) {
        console.log("💰 가격 요소 찾음:", selector, priceEl.innerText);
        break;
      }
    }

    const title = titleEl?.innerText.trim() || "제목 없음";
    let price = null;
    
    if (priceEl && priceEl.innerText.trim()) {
      const priceText = priceEl.innerText.trim();
      console.log("💰 원본 가격 텍스트:", priceText);
      price = parseInt(priceText.replace(/[^\d]/g, ''));
      console.log("💰 파싱된 가격:", price);
    }

    return { productId, title, price };
  }

  // 페이지 로드 완료 후 가격 추출 시도
  function tryExtractPrice() {
    const { productId, title, price } = extractProductInfo();
    
    console.log("🔍 상품 정보 추출:", { productId, title, price });

    // 가격이 있으면 저장
    if (productId && price && !isNaN(price)) {
      fetch(`${API_BASE}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          title: title,
          price: price
        })
      }).then(res => {
        if (res.ok) {
          console.log("✅ 가격 저장 완료:", price);
        } else {
          console.log("❌ 가격 저장 실패");
        }
      }).catch(error => {
        console.log("❌ 가격 저장 에러:", error);
      });
    } else {
      console.log("❌ 상품 정보 부족:", { productId, price });
    }
  }

  // 페이지 로드 완료 후 여러 번 시도
  setTimeout(tryExtractPrice, 1000);
  setTimeout(tryExtractPrice, 2000);
  setTimeout(tryExtractPrice, 3000);

  // 팝업에서 요청 시 상품 정보 전달
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "GET_PRODUCT_INFO") {
      const { productId, title, price } = extractProductInfo();
      console.log("📤 팝업에 전달할 정보:", { product_id: productId, title, price });
      sendResponse({
        product_id: productId,
        title: title,
        price: price
      });
    }
  });
})();
