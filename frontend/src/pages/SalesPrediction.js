import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const SalesPrediction = () => {
    return (
        <div className="container">
            <h1><FaChartLine /> 销售趋势预测</h1>
            <p>利用先进的机器学习算法，分析历史贸易数据，提供准确的销售趋势预测，帮助您优化贸易策略，提高盈利能力。</p>
            <div className="image-container">
                <img src="https://dummyimage.com/1200x600/008000/ffffff&text=销售预测图片" alt="销售预测图片" />
            </div>
        </div>
    );
};

export default SalesPrediction;    