document.addEventListener('DOMContentLoaded', () => {
    const favoritesList = JSON.parse(localStorage.getItem('favorites')) || [];

    const fetchFavoriteCoins = async () => {
        try {
            const promises = favoritesList.map(coinId => fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`).then(res => res.json()));
            const favoriteCoins = await Promise.all(promises);
            displayFavoriteCoins(favoriteCoins);
        } catch (error) {
            console.error('Error fetching favorite coins:', error);
        }
    };

    const displayFavoriteCoins = (coins) => {
        const favoritesListElement = document.getElementById('favorites-list');
        favoritesListElement.innerHTML = coins.map(coin => `
            <div class="favoritesCrypto-item">
                <img src="${coin.image.small}" alt="${coin.name}">
                <h2>${coin.name}</h2>
                <p>Price: $${coin.market_data.current_price.usd}</p>
                <p>Market Cap: $${coin.market_data.market_cap.usd}</p>
                <button onclick="location.href='coins.html?id=${coin.id}'">View Details</button>
            </div>
        `).join('');
    };

    fetchFavoriteCoins();
});
