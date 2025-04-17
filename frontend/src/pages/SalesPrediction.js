// src/pages/SalesPrediction.js
import React, { useState, useEffect } from 'react';
import { FaChartLine, FaRobot, FaGavel } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// 模拟历史贸易数据
const generateHistoricalData = () => {
    const data = [];
    for (let i = 2010; i <= 2023; i++) {
        data.push({
            year: i.toString(),
            sales: Math.floor(Math.random() * (1000 - 500 + 1)) + 500 // 模拟销售额在500 - 1000之间
        });
    }
    return data;
};

// 模拟销售趋势预测
const generatePredictionData = (historicalData) => {
    const lastYear = parseInt(historicalData[historicalData.length - 1].year);
    const predictionData = [];
    for (let i = 1; i <= 3; i++) {
        const nextYear = (lastYear + i).toString();
        const lastSales = historicalData[historicalData.length - 1].sales;
        const growthRate = Math.random() * 0.2; // 模拟增长率在0 - 20%之间
        const predictedSales = lastSales * (1 + growthRate);
        predictionData.push({
            year: nextYear,
            sales: predictedSales
        });
    }
    return predictionData;
};

const SalesPrediction = () => {
    const [historicalData, setHistoricalData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);

    useEffect(() => {
        const historical = generateHistoricalData();
        const prediction = generatePredictionData(historical);
        setHistoricalData(historical);
        setPredictionData(prediction);
    }, []);

    const combinedData = [...historicalData, ...predictionData];

    return (
        <div className="container">
            <h1><FaChartLine /> 销售趋势预测</h1>
            <p>利用先进的机器学习算法，分析历史贸易数据，提供准确的销售趋势预测，帮助您优化贸易策略，提高盈利能力。</p>
            <LineChart width={800} height={400} data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
            <div>
                <h2><FaRobot /> AI 服务</h2>
                <div>
                    <h3>智能销售预测</h3>
                    <p>基于历史数据，为您提供未来销售趋势的预测</p>
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