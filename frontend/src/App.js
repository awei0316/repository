// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DataVisualization from './pages/DataVisualization';
import SalesPrediction from './pages/SalesPrediction';
import UserCommunity from './pages/UserCommunity';
import Login from './pages/Login';
import Register from './pages/Register';
import TradeStatistics from './pages/TradeStatistics';
import MarketAnalysis from './pages/MarketAnalysis';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import BottomLinks from './components/BottomLinks';
import AIServiceIcon from './components/AIServiceIcon';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/data-visualization" element={<DataVisualization />} />
                <Route path="/sales-prediction" element={<SalesPrediction />} />
                <Route path="/user-community" element={<UserCommunity />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/trade-statistics" element={<TradeStatistics />} />
                <Route path="/market-analysis" element={<MarketAnalysis />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <BottomLinks />
            <Footer />
            <AIServiceIcon />
        </Router>
    );
}

export default App;