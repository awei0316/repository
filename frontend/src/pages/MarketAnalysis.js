import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const MarketAnalysis = () => {
    return (
        <div className="container">
            <h1><FaChartLine /> 市场分析</h1>
            <p>提供深度市场趋势分析</p>
            <div className="analysis-card">
                <h3>钢铁市场趋势</h3>
                <p>2024年钢铁价格预计上涨5%</p>
            </div>
        </div>
    );
};

export default MarketAnalysis;    