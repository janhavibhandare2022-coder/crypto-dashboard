import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Portfolio from './components/Portfolio';
import ExchangeCoins from './components/ExchangeCoins';
import CryptoChart from './components/CryptoChart';

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('usd');
  const [search, setSearch] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
        );
        if (response.ok) {
          const data = await response.json();
          setCryptos(data);
        }
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, [currency]);

  // Filter cryptos based on search input
  const filteredCryptos = cryptos.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        search={search}
        setSearch={setSearch}
      />

      {/* Main Dashboard Layout */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Section (Charts + Portfolio + Exchange) - 3 Columns */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          {/* Main Price Chart */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <CryptoChart coinId={selectedCoin} currency={currency} />
          </div>

          {/* Bottom Row: Portfolio & Exchange Coins */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Portfolio currency={currency} />
            <ExchangeCoins cryptos={cryptos} />
          </div>
        </div>

        {/* Right Section (Market Cap List / Sidebar) - 1 Column */}
        <div className="lg:col-span-1">
          <Sidebar
            cryptos={filteredCryptos}
            currency={currency}
            onSelectCoin={setSelectedCoin}
            selectedCoin={selectedCoin}
          />
        </div>
      </div>
    </div>
  );
}

export default App;