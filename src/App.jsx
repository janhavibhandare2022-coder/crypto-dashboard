import { useState, useEffect } from 'react'

function App() {
  const [cryptos, setCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [currency, setCurrency] = useState('usd')

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
        )
        if (!response.ok) {
          throw new Error('API डेटा लोड करताना अडचण आली.')
        }
        const data = await response.json()
        setCryptos(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCryptoData()
  }, [currency])

  const filteredCoins = cryptos.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  )

  const currencySymbol = currency === 'usd' ? '$' : '₹'

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '30px 20px', background: '#0b0f19', minHeight: '100vh', color: '#f8fafc' }}>
      <header style={{ maxWidth: '1100px', margin: '0 auto 30px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: '800' }}>⚡ Live Crypto Dashboard</h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>CoinGecko वरून थेट चालू बाजारभाव</p>
          </div>

          <div style={{ background: '#161f30', padding: '6px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setCurrency('usd')}
              style={{
                background: currency === 'usd' ? '#38bdf8' : 'transparent',
                color: currency === 'usd' ? '#0b0f19' : '#94a3b8',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('inr')}
              style={{
                background: currency === 'inr' ? '#38bdf8' : 'transparent',
                color: currency === 'inr' ? '#0b0f19' : '#94a3b8',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              INR (₹)
            </button>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <input
            type="text"
            placeholder="🔍 कॉईन शोधा (उदा. Bitcoin, ETH, Solana)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '16px',
              background: '#161f30',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              color: '#f8fafc',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {loading && (
          <p style={{ textAlign: 'center', color: '#38bdf8', fontSize: '18px', marginTop: '40px' }}>
            थेट डेटा लोड होत आहे...
          </p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#f87171', background: '#ef444420', padding: '12px', borderRadius: '8px' }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredCoins.length > 0 ? (
              filteredCoins.map((coin) => {
                const isProfit = coin.price_change_percentage_24h >= 0
                return (
                  <div
                    key={coin.id}
                    style={{
                      background: '#161f30',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid #1e293b',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={coin.image} alt={coin.name} style={{ width: '36px', height: '36px' }} />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600' }}>{coin.name}</h3>
                        <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>{coin.symbol}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700' }}>
                        {currencySymbol}{coin.current_price.toLocaleString()}
                      </div>
                      <div
                        style={{
                          color: isProfit ? '#4ade80' : '#f87171',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginTop: '4px'
                        }}
                      >
                        {isProfit ? '▲ +' : '▼ '}
                        {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                      Market Cap: {currencySymbol}{coin.market_cap.toLocaleString()}
                    </div>
                  </div>
                )
              })
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8', padding: '40px 0' }}>
                कोणतेही कॉईन सापडले नाही.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App