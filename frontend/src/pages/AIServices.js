import React from 'react';
import { FaRobot, FaGavel } from 'react-icons/fa';

const AIServices = () => {
    return (
        <div className="container">
            <h1><FaRobot /> AI 服务</h1>
            <div className="service-card">
                <h3>智能翻译</h3>
                <p>支持多语言实时翻译，打破贸易语言障碍</p>
            </div>
            <div className="service-card">
                <h3>合同审查</h3>
                <p><FaGavel /> 自动审查合同条款，确保合规性</p>
            </div>
        </div>
    );
};

export default AIServices;    