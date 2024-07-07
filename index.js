document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
  const params = {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 10,
    page: 1,
  };

  const searchInput = document.getElementById("search");
  let debounceTimer;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      params.page = 1;
      fetchCoins(searchInput.value);
    }, 300);
  });

  const fetchCoins = async (searchQuery = "") => {
    try {
      const response = await fetch(
        `${apiUrl}?vs_currency=${params.vs_currency}&order=${params.order}&per_page=${params.per_page}&page=${params.page}`
      );
      const data = await response.json();
      displayCoins(
        data.filter((coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setupPagination(5);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const displayCoins = (coins) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const cryptoList = document.getElementById("crypto-list");
    cryptoList.innerHTML = coins
      .map((coin) => {
        const isFavorite = favorites.includes(coin.id);
        return `
          <tr class="crypto-item" data-id="${coin.id}">
            <td><img src="${coin.image}" alt="${coin.name}" width="30" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price}</td>
            <td style="color: ${
              coin.price_change_percentage_24h > 0 ? "green" : "red"
            };">
              ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>
              <button class="${
                isFavorite ? "remove" : "add"
              }" onclick="toggleFavorite(event, '${coin.id}')">
                ${isFavorite ? "Remove" : "Add to Favorites"}
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const toggleFavorite = (event, coinId) => {
    event.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(coinId)) {
      favorites = favorites.filter((id) => id !== coinId);
    } else {
      favorites.push(coinId);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    fetchCoins(searchInput.value);
  };

  const setupPagination = (totalPages) => {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("div");
      pageItem.classList.add("page-item");
      if (i === params.page) {
        pageItem.classList.add("active");
      }
      const pageLink = document.createElement("a");
      pageLink.href = "#";
      pageLink.innerText = i;
      pageLink.addEventListener("click", (event) => {
        event.preventDefault();
        params.page = i;
        fetchCoins(searchInput.value);
      });
      pageItem.appendChild(pageLink);
      pagination.appendChild(pageItem);
    }
  };

  fetchCoins();
});
