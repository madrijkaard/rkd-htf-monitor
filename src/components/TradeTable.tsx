import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip
} from 'recharts';

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
  logo?: string;
  name?: string;
  description?: string;
  date_added?: string;
  website?: string;
  technical_doc?: string;
}

interface Props {
  trades: Trade[];
}

export function TradeTable({ trades }: Props) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  if (trades.length === 0) return null;

  const max = {
    performance_24: Math.max(...trades.map((t) => t.performance_24)),
    performance_btc_24: Math.max(...trades.map((t) => t.performance_btc_24)),
  };

  const min = {
    performance_24: Math.min(...trades.map((t) => t.performance_24)),
    performance_btc_24: Math.min(...trades.map((t) => t.performance_btc_24)),
  };

  const highlight = (value: number, field: keyof typeof max) => {
    if (value === max[field]) return 'text-blue-500 font-bold';
    if (value === min[field]) return 'text-orange-500 font-bold';
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return '';
  };

  const renderPressureArrow = (trade: Trade) => {
    if (trade.volume === 0) return '';
    const buyPressure = trade.taker_buy_base_volume / trade.volume;

    if (buyPressure > 0.7) return <span className="text-yellow-400">↑</span>;  // alta compra
    if (buyPressure > 0.5) return <span className="text-blue-500">↑</span>;    // compra
    if (buyPressure < 0.3) return <span className="text-gray-400">↓</span>;    // alta venda
    if (buyPressure < 0.5) return <span className="text-red-500">↓</span>;     // venda

    return ''; // 50% exato
  };

  return (
    <>
      <div className="rounded-xl shadow-lg bg-white dark:bg-black px-2 py-4 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="table-auto w-fit min-w-[900px] text-base text-gray-800 dark:text-gray-100">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                  {['Symbol', 'Zone', '24h', 'BTC', 'Pressure'].map((header) => (
                    <th key={header} className="px-5 py-3 text-left whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.map((t, i) => (
                  <tr
                    key={`${t.symbol}-${t.zone}-${i}`}
                    className="cursor-pointer even:bg-gray-50 dark:even:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setSelectedTrade(t)}
                  >
                    <td className="px-5 py-3 font-semibold">{t.symbol}</td>
                    <td className="px-5 py-3">{t.zone}</td>
                    <td className={`px-5 py-3 font-mono ${highlight(t.performance_24, 'performance_24')}`}>
                      {t.performance_24.toFixed(2)}
                    </td>
                    <td className={`px-5 py-3 font-mono ${highlight(t.performance_btc_24, 'performance_btc_24')}`}>
                      {t.performance_btc_24.toFixed(2)}
                    </td>
                    <td className="py-3 text-xl text-center w-[80px]">
                      {renderPressureArrow(t)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setSelectedTrade(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Detalhes de {selectedTrade.symbol}</h2>

            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200 mb-6">
              {selectedTrade.logo && (
                <li className="flex justify-center">
                  <img src={selectedTrade.logo} alt="logo" className="h-10" />
                </li>
              )}
              {selectedTrade.name && (
                <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                  <span className="font-medium">name:</span>
                  <span>{selectedTrade.name}</span>
                </li>
              )}
              {selectedTrade.description && (
                <li className="text-justify text-xs text-gray-600 dark:text-gray-300">{selectedTrade.description}</li>
              )}
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="font-medium">symbol:</span>
                <span>{selectedTrade.symbol}</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="font-medium">zone:</span>
                <span>{selectedTrade.zone}</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="font-medium">amplitude:</span>
                <span>{(selectedTrade.log_amplitude * 100).toFixed(2)}%</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="font-medium">position:</span>
                <span>{(selectedTrade.log_position * 100).toFixed(2)}%</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="font-medium">MA200:</span>
                <span>{selectedTrade.amplitude_ma_200.toFixed(2)}%</span>
              </li>
              {selectedTrade.date_added && (
                <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                  <span className="font-medium">added:</span>
                  <span>{selectedTrade.date_added}</span>
                </li>
              )}
              {selectedTrade.website && (
                <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                  <span className="font-medium">site:</span>
                  <a href={selectedTrade.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {selectedTrade.website}
                  </a>
                </li>
              )}
              {selectedTrade.technical_doc && (
                <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                  <span className="font-medium">documento:</span>
                  <a href={selectedTrade.technical_doc} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    whitepaper
                  </a>
                </li>
              )}
            </ul>

            <div className="flex flex-col items-center">
              <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100">
                Buyer vs. Seller Pressure
              </h3>
              <PieChart width={250} height={250}>
                <Pie
                  data={[
                    {
                      name: 'Buyer',
                      value:
                        selectedTrade.volume === 0
                          ? 0
                          : selectedTrade.taker_buy_base_volume / selectedTrade.volume,
                    },
                    {
                      name: 'Seller',
                      value:
                        selectedTrade.volume === 0
                          ? 0
                          : 1 - selectedTrade.taker_buy_base_volume / selectedTrade.volume,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  <Cell fill="#2b6cb0" />
                  <Cell fill="#e53e3e" />
                </Pie>
                <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
              </PieChart>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
