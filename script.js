console.log("hello");
let data;

// fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
//   .then(response => response.json())
//   .then(data => {
//     renderCryptoTable(data);
//   })
//   .catch(error => console.error('Error fetching data:', error));

async function fetchData() {
    try {
      const responseData = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      console.log(responseData);
      if(!responseData.ok) {
        throw new Error("Network response was not ok");
      }
      data = await responseData.json();
      console.log(data);

      renderCryptoTable(data);
    } catch (error) {
        if(error.response && error.response.status === 429) {
            console.log("Rate limit exceeded. Waiting before retrying");
            setTimeout(fetchData, 60000);
        } else {
            console.error("Error fetching data:" , error);
            setTimeout(fetchData, 60000);
        }
    }
  }

fetchData();

function renderCryptoTable(data) {
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    cryptoTableBody.innerHTML = '';
    data.forEach(crypto => {
        const row = `
        <tr>
          <td><img src="${crypto.image}" alt="${crypto.name}" class="logo"></td>
          <td style="text-align: left;">${crypto.name}</td>
          <td>${crypto.symbol.toUpperCase()}</td>
          <td style="text-align: right;">$${crypto.current_price}</td>
          <td style="text-align: right;">${crypto.total_volume}</td>
          <td style="text-align: right;">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
          <td style="text-align: right;">Mkt cap:${crypto.market_cap}</td>
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

