import React from 'react';
import { FaRobot, FaGavel } from 'react-icons/fa';
import Card from '../components/Card';

const AIServices = () => {
    return (
        <div className="container">
            <h1><FaRobot /> AI 服务</h1>
            <Card>
                <h3>智能翻译</h3>
                <p>支持多语言实时翻译，打破贸易语言障碍</p>
            </Card>
            <Card>
                <h3>合同审查</h3>
                <p><FaGavel /> 自动审查合同条款，确保合规性</p>
            </Card>
        </div>
    );
};

export default AIServices;    