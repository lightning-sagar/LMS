import { Link } from 'react-router-dom';
import { 
  Shield, 
  TrendingUp, 
  Eye, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Early Disease Detection',
      description: 'AI-powered monitoring to detect livestock diseases before they spread, saving lives and reducing financial losses.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Continuous monitoring of temperature, humidity, and environmental conditions with instant alerts.'
    },
    {
      icon: Eye,
      title: 'Live Video Monitoring',
      description: 'Stream live feeds from your farm with intelligent detection capabilities powered by computer vision.'
    },
    {
      icon: Clock,
      title: '24/7 Surveillance',
      description: 'Round-the-clock monitoring ensures no critical moments are missed, protecting your livestock investment.'
    }
  ];

  const stats = [
    { value: '95%', label: 'Detection Accuracy' },
    { value: '24/7', label: 'Monitoring' },
    { value: '< 1min', label: 'Response Time' },
    { value: '80%', label: 'Cost Reduction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-green-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Protect Your
              <span className="text-emerald-600 block">Livestock</span>
              <span className="text-3xl md:text-4xl font-medium text-gray-700">
                with Smart Monitoring
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced agriculture technology that detects diseases early through real-time monitoring, 
              preventing animal deaths and significant financial losses with AI-powered surveillance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/temperature"
                className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                Start Monitoring
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/feed"
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Live Feed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Farm Monitoring
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our integrated system provides complete oversight of your livestock health 
              and environmental conditions, ensuring optimal farm management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100"
              >
                <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Problem</h2>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Farmers often detect diseases too late due to a lack of real-time health monitoring, 
                leading to animal deaths and significant financial losses as treatment is delayed.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-200" />
                  <span className="text-emerald-100">Late disease detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-200" />
                  <span className="text-emerald-100">Increased mortality rates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-200" />
                  <span className="text-emerald-100">Significant financial losses</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Solution</h2>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Advanced monitoring technology that provides early detection, real-time alerts, 
                and comprehensive health tracking to protect your livestock investment.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Zap className="h-8 w-8 text-emerald-200 mb-2" />
                  <h4 className="font-semibold mb-1">Instant Alerts</h4>
                  <p className="text-sm text-emerald-100">Real-time notifications</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <BarChart3 className="h-8 w-8 text-emerald-200 mb-2" />
                  <h4 className="font-semibold mb-1">Data Analytics</h4>
                  <p className="text-sm text-emerald-100">Comprehensive insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Protect Your Farm?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start monitoring your livestock health with our advanced agriculture technology today.
          </p>
          <Link
            to="/temperature"
            className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold text-lg rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;