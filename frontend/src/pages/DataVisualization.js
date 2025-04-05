// src/pages/DataVisualization.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { memo } from 'react';
import HeatMapGrid from 'react-heatmap-grid';
import GaugeChart from 'react-gauge-chart';

// 模拟数据
const generateData = () => {
    return [
        { name: '2020', imports: 1200, exports: 1500, price: 100 },
        { name: '2021', imports: 1300, exports: 1600, price: 110 },
        { name: '2022', imports: 1100, exports: 1400, price: 90 },
        { name: '2023', imports: 1400, exports: 1700, price: 120 },
    ];
};

// 模拟仪表盘数据
const generateDashboardData = () => {
    return {
        tradeVolume: Math.random() * 100,
        exchangeRate: Math.random() * 10,
        stockPrices: [
            { name: 'Stock A', price: Math.random() * 200, change: Math.random() > 0.5 ? 'up' : 'down' },
            { name: 'Stock B', price: Math.random() * 200, change: Math.random() > 0.5 ? 'up' : 'down' },
            { name: 'Stock C', price: Math.random() * 200, change: Math.random() > 0.5 ? 'up' : 'down' }
        ]
    };
};

const LineChartComponent = memo(({ data }) => (
    <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="imports" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="exports" stroke="#82ca9d" />
    </LineChart>
));

const BarChartComponent = memo(({ data }) => (
    <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="price" fill="#ff7300" />
    </BarChart>
));

const PieChartComponent = memo(({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
        <PieChart width={400} height={400}>
            <Pie
                data={data}
                dataKey="exports"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
});

const HeatMapComponent = memo(({ data }) => {
    const heatmapData = data.map(item => [item.name, item.price]);
    return (
        <HeatMapGrid
            width={800}
            height={400}
            data={heatmapData}
            xLabels={data.map(item => item.name)}
            yLabels={['Price']}
        />
    );
});

const StockLineChart = memo(({ data }) => (
    <LineChart width={300} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
            type="monotone"
            dataKey="price"
            stroke={data[data.length - 1].change === 'up' ? '#00FF00' : '#FF0000'}
            activeDot={{ r: 8 }}
        />
    </LineChart>
));

const DataVisualization = () => {
    const [data, setData] = useState(generateData());
    const [selectedYear, setSelectedYear] = useState('');
    const [chartType, setChartType] = useState('line');
    const [dashboardData, setDashboardData] = useState(generateDashboardData());

    useEffect(() => {
        const interval = setInterval(() => {
            setData(generateData());
            setDashboardData(generateDashboardData());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const filteredData = useMemo(() => {
        if (!selectedYear) return data;
        return data.filter(item => item.name === selectedYear);
    }, [data, selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleChartTypeChange = () => {
        const chartTypes = ['line', 'bar', 'pie', 'heatmap'];
        const currentIndex = chartTypes.indexOf(chartType);
        const nextIndex = (currentIndex + 1) % chartTypes.length;
        setChartType(chartTypes[nextIndex]);
    };

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return <LineChartComponent data={filteredData} />;
            case 'bar':
                return <BarChartComponent data={filteredData} />;
            case 'pie':
                return <PieChartComponent data={filteredData} />;
            case 'heatmap':
                return <HeatMapComponent data={filteredData} />;
            default:
                return <LineChartComponent data={filteredData} />;
        }
    };

    return (
        <div className="container">
            <h1>数据可视化</h1>
            <p>通过图表展示关键贸易指标</p>
            <select onChange={handleYearChange} value={selectedYear}>
                <option value="">全部年份</option>
                {data.map(item => (
                    <option key={item.name} value={item.name}>
                        {item.name}
                    </option>
                ))}
            </select>
            <button onClick={handleChartTypeChange}>切换图表类型</button>

            {/* 动态仪表盘 */}
            <div className="dashboard">
                <h2>动态仪表盘</h2>
                <div className="gauge-container flex justify-between">
                    <div>
                        <h3>贸易量</h3>
                        <GaugeChart
                            id="gauge-chart1"
                            nrOfLevels={30}
                            percent={dashboardData.tradeVolume / 100}
                            arcWidth={0.3}
                            colors={['#FF5F6D', '#FFC371']}
                        />
                    </div>
                    <div>
                        <h3>汇率</h3>
                        <GaugeChart
                            id="gauge-chart2"
                            nrOfLevels={30}
                            percent={dashboardData.exchangeRate / 10}
                            arcWidth={0.3}
                            colors={['#00F260', '#0575E6']}
                        />
                    </div>
                    <div>
                        <h3>股票价格</h3>
                        <StockLineChart data={dashboardData.stockPrices} />
                    </div>
                </div>
                <div className="stock-suggestions">
                    <h3>自选股建议</h3>
                    <ul>
                        {dashboardData.stockPrices.map((stock, index) => (
                            <li key={index}>
                                {stock.name}: 价格 {stock.price.toFixed(2)}，走势 {stock.change === 'up' ? '上涨' : '下跌'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {renderChart()}
        </div>
    );
};

export default DataVisualization;