import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.tsx';
import LandingPage from './pages/LandingPage';
import TemperaturePage from './pages/TemperaturePage.tsx';
import FeedPage from './pages/FeedPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/temperature" element={<TemperaturePage />} />
          <Route path="/feed" element={<FeedPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;