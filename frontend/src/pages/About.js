import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Card from '../components/Card';

const About = () => {
    return (
        <div className="container">
            <h1><FaInfoCircle /> 关于我们</h1>
            <Card>
                <p>UniTrade是一家专注于国际贸易的供应链管理平台，致力于为全球企业提供高效、安全的贸易解决方案。</p>
            </Card>
        </div>
    );
};

export default About;    