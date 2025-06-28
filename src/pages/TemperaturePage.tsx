import { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  Thermometer,
  Droplets,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Gauge
} from 'lucide-react';

interface SensorData {
  temp: number;
  humidity: number;
  pressure: number;
  timestamp: string;
}

const TemperaturePage = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(
        'https://1c50-2409-40c4-3003-6795-5608-4900-c146-a753.ngrok-free.app/sensor',
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const sensor = await res.json();

      const newDataPoint = {
        temp: sensor.temperature,
        humidity: sensor.humidity,
        pressure: sensor.pressure,
        timestamp: new Date().toLocaleTimeString()
      };

      setCurrentData(newDataPoint);
      setData(prev => {
        const updated = [...prev, newDataPoint].slice(-20);
        localStorage.setItem('sensorData', JSON.stringify(updated));
        return updated;
      });

      setIsConnected(true);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('sensorData');
    if (savedData) {
      const parsed: SensorData[] = JSON.parse(savedData);
      setData(parsed);
      setCurrentData(parsed[parsed.length - 1]);
    }

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTemperatureStatus = (temp: number) => {
    if (temp < 18) return { status: 'low', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (temp > 28) return { status: 'high', color: 'text-red-600', bg: 'bg-red-100' };
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 30) return { status: 'low', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (humidity > 70) return { status: 'high', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const tempStatus = currentData ? getTemperatureStatus(currentData.temp) : null;
  const humidityStatus = currentData ? getHumidityStatus(currentData.humidity) : null;

  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Environmental Monitoring</h1>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isConnected ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <span className="text-gray-500">
              Last updated: {currentData?.timestamp || 'Never'}
            </span>
          </div>
        </div>

        {/* Current Readings */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Temperature */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-3 rounded-xl">
                  <Thermometer className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Temperature</h3>
                  <p className="text-sm text-gray-500">Current reading</p>
                </div>
              </div>
              {tempStatus && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${tempStatus.bg} ${tempStatus.color}`}>
                  {tempStatus.status}
                </div>
              )}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentData ? `${currentData.temp}°C` : '--'}
            </div>
            <p className="text-gray-600">Optimal range: 18-28°C</p>
          </div>

          {/* Humidity */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Humidity</h3>
                  <p className="text-sm text-gray-500">Current reading</p>
                </div>
              </div>
              {humidityStatus && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${humidityStatus.bg} ${humidityStatus.color}`}>
                  {humidityStatus.status}
                </div>
              )}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentData ? `${currentData.humidity}%` : '--'}
            </div>
            <p className="text-gray-600">Optimal range: 30-70%</p>
          </div>

          {/* Pressure */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Gauge className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pressure</h3>
                  <p className="text-sm text-gray-500">Current reading</p>
                </div>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentData ? `${currentData.pressure} hPa` : '--'}
            </div>
            <p className="text-gray-600">Typical range: 980–1050 hPa</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <ChartCard
            title="Temperature Trend"
            iconColor="text-red-600"
            bgColor="bg-red-100"
            strokeColor="#dc2626"
            gradientId="tempGradient"
            dataKey="temp"
            unit="°C"
            data={data}
          />

          {/* Humidity Chart */}
          <ChartCard
            title="Humidity Trend"
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
            strokeColor="#2563eb"
            gradientId="humidityGradient"
            dataKey="humidity"
            unit="%"
            data={data}
          />

          {/* Pressure Chart */}
          <ChartCard
            title="Pressure Trend"
            iconColor="text-yellow-600"
            bgColor="bg-yellow-100"
            strokeColor="#f59e0b"
            gradientId="pressureGradient"
            dataKey="pressure"
            unit="hPa"
            data={data}
          />
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({
  title,
  iconColor,
  bgColor,
  strokeColor,
  gradientId,
  dataKey,
  unit,
  data
}: {
  title: string;
  iconColor: string;
  bgColor: string;
  strokeColor: string;
  gradientId: string;
  dataKey: keyof SensorData;
  unit: string;
  data: SensorData[];
}) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
    <div className="flex items-center space-x-3 mb-6">
      <div className={`${bgColor} p-2 rounded-lg`}>
        <TrendingUp className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
  dataKey="timestamp"
  stroke="#666"
  fontSize={12}
  tickFormatter={() => ''}
/>
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value} ${unit}`, title.split(' ')[0]]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            fill={`url(#${gradientId})`}
            strokeWidth={2}
          />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TemperaturePage;
