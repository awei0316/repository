// src/pages/SalesPrediction.js
import React from 'react';
import { FaChartLine, FaRobot, FaGavel } from 'react-icons/fa';

const SalesPrediction = () => {
    return (
        <div className="container">
            <h1><FaChartLine /> 销售趋势预测</h1>
            <p>利用先进的机器学习算法，分析历史贸易数据，提供准确的销售趋势预测，帮助您优化贸易策略，提高盈利能力。</p>
            <div className="image-container">
                <img src="https://dummyimage.com/1200x600/008000/ffffff&text=销售预测图片" alt="销售预测图片" />
            </div>
            <div>
                <h2><FaRobot /> AI 服务</h2>
                <div>
                    <h3>智能翻译</h3>
                    <p>支持多语言实时翻译，打破贸易语言障碍</p>
                </div>
                <div>
                    <h3>合同审查</h3>
                    <p><FaGavel /> 自动审查合同条款，确保合规性</p>
                </div>
            </div>
        </div>
    );
};

export default SalesPrediction;