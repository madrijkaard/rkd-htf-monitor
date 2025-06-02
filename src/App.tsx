import { useEffect, useState } from 'react';
import { TradeTable } from './components/TradeTable';
import { ZonePieChart } from './components/ZonePieChart';
import { Sun, Moon } from 'lucide-react';
import { WeatherIndicator } from './components/WeatherIndicator';

interface Trade {
  symbol: string;
  zone: string;
  performance_24: number;
  performance_btc_24: number;
  amplitude_ma_200: number;
  log_amplitude: number;
  log_position: number;
  volume: number;
  quote_volume: number;
  trades_count: number;
  taker_buy_base_volume: number;
  taker_buy_quote_volume: number;
}

interface ZoneDistribution {
  zone: string;
  count: number;
}

interface ApiResponse {
  trades: Trade[];
  timestamp: string;
  zone_distribution: ZoneDistribution[];
}

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [zoneDistribution, setZoneDistribution] = useState<ZoneDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'cryptos' | 'telemetry' | 'assistant'>('cryptos');
  const [darkMode, setDarkMode] = useState(false);

  const fetchData = () => {
    fetch('http://localhost:8080/trades/monitor')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: ApiResponse) => {
        const sorted = [...data.trades].sort((a, b) => {
          const zoneA = parseInt(a.zone.replace(/\D/g, '')) || 0;
          const zoneB = parseInt(b.zone.replace(/\D/g, '')) || 0;

          if (zoneA !== zoneB) return zoneB - zoneA;
          if (b.performance_24 !== a.performance_24) return b.performance_24 - a.performance_24;
          return b.performance_btc_24 - a.performance_btc_24;
        });

        setTrades(sorted);
        setZoneDistribution(data.zone_distribution);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados', err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 dark:text-white overflow-x-hidden relative">
        {/* Ícone do tempo no canto superior esquerdo */}
        <WeatherIndicator />

        {/* Header */}
        <div className="w-full flex justify-center items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 relative">
          <div className="flex space-x-4">
            {['cryptos', 'telemetry', 'assistant'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-semibold capitalize rounded ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 dark:bg-blue-600 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                }`}
                onClick={() => setActiveTab(tab as typeof activeTab)}
              >
                {tab === 'cryptos'
                  ? 'Cryptos'
                  : tab === 'telemetry'
                  ? 'Telemetry'
                  : 'Assistant'}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="absolute right-6 p-2 rounded bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Main content */}
        <main className="w-full px-4 py-6">
          {loading && <p>Carregando dados...</p>}
          {error && <p className="text-red-500">Erro ao carregar dados.</p>}

          {!loading && !error && (
            <>
              {activeTab === 'cryptos' && (
                <div className="w-full flex justify-center px-4">
                  <TradeTable trades={trades} />
                </div>
              )}

              {activeTab === 'telemetry' && (
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-screen-2xl px-4">
                    <ZonePieChart trades={trades} zoneDistribution={zoneDistribution} />
                  </div>
                </div>
              )}

              {activeTab === 'assistant' && (
                <div className="text-gray-600 dark:text-gray-300 text-center">
                  Assistant
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
