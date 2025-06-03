import {
  AreaChart, Area,
  ResponsiveContainer,
  CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, BarChart, Bar
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
}

interface ZoneDistribution {
  zone: string;
  count: number;
}

interface Props {
  trades: Trade[];
  zoneDistribution: ZoneDistribution[];
}

export function ZonePieChart({ trades, zoneDistribution }: Props) {
  const zones = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8'];

  const maxCount = Math.max(...zoneDistribution.map((z) => z.count));
  const maxY = Math.ceil(maxCount / 20) * 20;
  const tickValues = Array.from({ length: maxY / 20 + 1 }, (_, i) => i * 20);

  const tradesPorZona = zones.map((zone) => {
    const soma = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.trades_count, 0);
    const totalTrades = trades.reduce((acc, t) => acc + t.trades_count, 0);
    return { zone, percentual: soma / totalTrades };
  });

  const quoteVolumePorZona = zones.map((zone) => {
    const totalQuoteVolume = trades.reduce((acc, t) => acc + t.quote_volume, 0);
    const somaQuoteVolume = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.quote_volume, 0);
    return { zone, percentual: somaQuoteVolume / totalQuoteVolume };
  });

  const takerBuyBaseVolumePorZona = zones.map((zone) => {
    const totalTakerBuy = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.taker_buy_base_volume, 0);
    const totalVolume = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.volume, 0);
    const percentual = totalVolume === 0 ? 0 : totalTakerBuy / totalVolume;
    return { zone, percentual };
  });

  const takerSellBaseVolumePorZona = takerBuyBaseVolumePorZona.map(({ zone, percentual }) => ({
    zone,
    percentual: 1 - percentual,
  }));

  const performanceBTC24PorZona = zones.map((zone) => {
    const soma = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.performance_btc_24, 0);
    return { zone, valor: soma };
  });

  const amplitudePorZona = zones.map((zone) => {
    const soma = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.amplitude_ma_200, 0);
    return { zone, valor: soma };
  });

  const takerBuyQuoteVolumePorZona = zones.map((zone) => {
    const soma = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.taker_buy_quote_volume, 0);
    return { zone, soma };
  });

  const totalBuyVolume = takerBuyQuoteVolumePorZona.reduce((acc, item) => acc + item.soma, 0);

  const percentualTakerBuyQuoteVolume = takerBuyQuoteVolumePorZona.map(({ zone, soma }) => ({
    zone,
    percentual: totalBuyVolume === 0 ? 0 : soma / totalBuyVolume,
  }));

  const performance24hPorZona = zones.map((zone) => {
    const soma = trades
      .filter((t) => t.zone === zone)
      .reduce((acc, t) => acc + t.performance_24, 0);
    return { zone, valor: soma };
  });

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Coluna 1 */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-center mb-2">Crypto by Zone</h3>
            <ResponsiveContainer width={300} height={300}>
              <AreaChart data={zoneDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis domain={[0, maxY]} ticks={tickValues} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="amount of cryptos"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-center mb-2">Buyer Pressure by Zone</h3>
            <ResponsiveContainer width={300} height={300}>
              <BarChart data={takerBuyBaseVolumePorZona}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="percentual" name="buyer pressure" fill="#2b6cb0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-center mb-2">Completed Trades</h3>
            <ResponsiveContainer width={300} height={300}>
              <AreaChart data={tradesPorZona}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="percentual"
                  name="percentage of trades"
                  stroke="#4c51bf"
                  fill="#a3bffa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-center mb-2">Seller Pressure by Zone</h3>
            <ResponsiveContainer width={300} height={300}>
              <BarChart data={takerSellBaseVolumePorZona}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="percentual" name="seller pressure" fill="#e53e3e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coluna 3 */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-center mb-2">BTC 24-Hour Performance</h3>
            <ResponsiveContainer width={300} height={300}>
              <AreaChart data={performanceBTC24PorZona}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="valor"
                  name="performance sum"
                  stroke="#ed8936"
                  fill="#fbd38d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-center mb-2">Crypto 24-Hour Performance</h3>
            <ResponsiveContainer width={300} height={300}>
              <AreaChart data={performance24hPorZona}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="valor"
                  name="performance sum"
                  stroke="#68d391"
                  fill="#c6f6d5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coluna 4 */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-center mb-2">Distance from the 200 MA</h3>
            <ResponsiveContainer width={300} height={300}>
              <AreaChart data={amplitudePorZona}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="valor"
                  name="amplitude sum"
                  stroke="#4299e1"
                  fill="#bee3f8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-center mb-2">USDT (Market Buy Orders)</h3>
            <ResponsiveContainer width={300} height={300}>
              <AreaChart data={percentualTakerBuyQuoteVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="percentual"
                  name="aggressive purchases"
                  stroke="#38a169"
                  fill="#9ae6b4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
