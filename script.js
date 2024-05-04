console.log("hello");
let data;

fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
  .then(response => response.json())
  .then(data => {
    renderCryptoTable(data);
  })
  .catch(error => console.error('Error fetching data:', error));

async function fetchData() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      console.log(response);
      data = await response.json();
      console.log(data);

      renderCryptoTable(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

fetchData();

function renderCryptoTable(data) {
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    cryptoTableBody.innerHTML = '';
    data.forEach(crypto => {
        const row = `
        <tr>
          <td><img src="${crypto.image}" alt="${crypto.name}" class="logo"> ${crypto.name}</td>
          <td>${crypto.name}</td>
          <td>${crypto.symbol.toUpperCase()}</td>
          <td>$${crypto.current_price}</td>
          <td>${crypto.total_volume}</td>
          <td>${crypto.price_change_percentage_24h.toFixed(2)}%</td>
          <td>Mkt cap:${crypto.market_cap}</td>
        </tr>
      `;
      cryptoTableBody.innerHTML += row;
    });

    // search functionality
    document.getElementById('searchInput').addEventListener('input', () => {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const filteredData = data.filter(crypto => crypto.name.toLowerCase().includes(searchInput) || crypto.symbol.toLowerCase().includes(searchInput));
        renderCryptoTable(filteredData);
    })

    //Sort by Market Cap functionality
    document.getElementById('sortMarketCapButton').addEventListener('click', () => {
        data.sort((a, b) => a.market_cap - b.market_cap);
        renderCryptoTable(data);
    })

    //Sort by Percentage Change functionality
    document.getElementById('sortPercentageChangeButton').addEventListener('click', () => {
        data.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        renderCryptoTable(data);
    })
}

