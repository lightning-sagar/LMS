import  { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Thermometer, Droplets, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface SensorData {
  temp: number;
  humidity: number;
  timestamp: string;
}

const TemperaturePage = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Mock API call - replace with your actual endpoint
  const fetchData = async () => {
    try {
      // Simulating API call with random data
      const mockData = {
        temp: Math.round((Math.random() * 10 + 20) * 10) / 10, // 20-30°C
        humidity: Math.round((Math.random() * 30 + 40) * 10) / 10, // 40-70%
      };
      
      const newDataPoint = {
        ...mockData,
        timestamp: new Date().toLocaleTimeString()
      };

      setCurrentData(newDataPoint);
      setData(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 data points for the graph
        return updated.slice(-20);
      });
      setIsConnected(true);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up interval to fetch data every 15 seconds
    const interval = setInterval(fetchData, 15000);
    
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
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {isConnected ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <span className="text-gray-500">Last updated: {currentData?.timestamp || 'Never'}</span>
          </div>
        </div>

        {/* Current Readings */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Temperature Trend</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}°C`, 'Temperature']}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#dc2626"
                    fill="url(#tempGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Humidity Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Humidity Trend</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Humidity']}
                  />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke="#2563eb"
                    fill="url(#humidityGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Sensors Online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Data Streaming</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Monitoring Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperaturePage;