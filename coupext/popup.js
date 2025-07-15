// API 서버 설정 - 서버 배포 시 이 부분을 수정하세요
const API_BASE = "http://127.0.0.1:8000";  // 개발용
// const API_BASE = "http://123.456.78.90:8000";  // 서버 배포 시 사용

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, "GET_PRODUCT_INFO", async (product) => {
    console.log("📥 팝업이 받은 정보:", product);
    
    if (!product || !product.price || !product.product_id) {
      console.log("❌ 상품 정보 부족:", { product });
      document.body.innerText = "상품 정보를 불러올 수 없습니다.";
      return;
    }

    // 가격 이력 불러오기
    let history = [];
    try {
      const res = await fetch(`${API_BASE}/history/${product.product_id}`);
      if (res.ok) {
        history = await res.json();
      }
    } catch (error) {
      console.log("가격 이력이 없습니다:", error);
    }
    const prices = history.map(h => h.price);

    const current = parseInt(product.price);
    
    // 데이터가 없거나 현재 가격만 있는 경우
    if (prices.length === 0) {
      document.getElementById("title").innerText = `상품 이름: ${product.title}`;
      document.getElementById("price").innerText = `현재 가격: ${current.toLocaleString()}원`;
      document.getElementById("status").innerText = "📊 첫 번째 가격 기록입니다. (새로고침 후 다시 확인해보세요)";
      return;
    }

    // 과거 가격들 중 최저가 계산 (현재 가격 제외)
    const minPrice = Math.min(...prices);
    const diff = current - minPrice;
    const diffPct = Math.round((diff / minPrice) * 100);

    document.getElementById("title").innerText = `상품 이름: ${product.title}`;
    document.getElementById("price").innerText = `현재 가격: ${current.toLocaleString()}원`;

    const status = document.getElementById("status");
    if (current <= minPrice) {
      status.innerText = "✅ 지금이 최근 30일 최저가입니다!";
    } else {
      status.innerText = `⚠️ 최저가보다 ${diff.toLocaleString()}원 (${diffPct}%) 더 비쌉니다.`;
    }
  });
});
