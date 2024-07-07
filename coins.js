document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const coinId = params.get("id");
  const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;

  const fetchCoinDetails = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      displayCoinDetails(data);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };

  const displayCoinDetails = (coin) => {
    const coinDetails = document.getElementById("coin-details");
    coinDetails.innerHTML = `
            <div class="coin-detail-item">
                <img src="${coin.image.large}" alt="${coin.name}">
                <h2>${coin.name}</h2>
                <div class="coin-info">
                <div class="info-item">
                    <span class="info-label">Rank:</span>
                    <span class="info-value">${coin.market_cap_rank}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Symbol:</span>
                    <span class="info-value">${coin.symbol}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Current Price:</span>
                    <span class="info-value">$${coin.market_data.current_price.usd}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Market Cap:</span>
                    <span class="info-value">$${coin.market_data.market_cap.usd}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">24h High:</span>
                    <span class="info-value">$${coin.market_data.high_24h.usd}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">24h Low:</span>
                    <span class="info-value">$${coin.market_data.low_24h.usd}</span>
                </div>
            </div>
                    <p>${coin.description.en}</p>
            </div>
        `;
  };

  fetchCoinDetails();
});
