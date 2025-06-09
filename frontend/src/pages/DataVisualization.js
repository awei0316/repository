// src/pages/DataVisualization.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { memo } from 'react';
import HeatMapGrid from 'react-heatmap-grid';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import EChartsComponent from '../components/EChartsComponent';

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
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 14 }} />
        <YAxis stroke="#555" tick={{ fontSize: 14 }} />
        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }} />
        <Legend wrapperStyle={{ fontSize: 14 }} />
        <Line type="monotone" dataKey="imports" stroke="#FF6B6B" activeDot={{ r: 8, fill: '#FF6B6B' }} />
        <Line type="monotone" dataKey="exports" stroke="#6BE675" />
    </LineChart>
));

const BarChartComponent = memo(({ data }) => (
    <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 14 }} />
        <YAxis stroke="#555" tick={{ fontSize: 14 }} />
        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }} />
        <Legend wrapperStyle={{ fontSize: 14 }} />
        <Bar dataKey="price" fill="#FFD166" barSize={30} />
    </BarChart>
));

const PieChartComponent = memo(({ data }) => {
    const COLORS = ['#FF6B6B', '#6BE675', '#FFD166', '#4D96FF'];
    return (
        <PieChart width={400} height={400}>
            <Pie
                data={data}
                dataKey="exports"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.exports}`}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }} />
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
            colors={['#E5F6FF', '#73A6FF', '#004DFF']}
        />
    );
});

const StockLineChart = memo(({ data }) => (
    <LineChart width={300} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 12 }} />
        <YAxis stroke="#555" tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }} />
        <Line
            type="monotone"
            dataKey="price"
            stroke={data[data.length - 1].change === 'up' ? '#6BE675' : '#FF6B6B'}
            activeDot={{ r: 6, fill: data[data.length - 1].change === 'up' ? '#6BE675' : '#FF6B6B' }}
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

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const tradeVolumeOptions = {
        chart: {
            type: 'radialBar',
            height: 250,
            toolbar: {
                show: false
            },
            foreColor: '#333',
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '60%'
                },
                dataLabels: {
                    name: {
                        show: true,
                        fontSize: '18px',
                        color: '#333'
                    },
                    value: {
                        show: true,
                        fontSize: '24px',
                        color: '#333'
                    }
                }
            }
        },
        labels: ['贸易量'],
        colors: ['#FF6B6B']
    };

    const exchangeRateOptions = {
        chart: {
            type: 'radialBar',
            height: 250,
            toolbar: {
                show: false
            },
            foreColor: '#333',
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '60%'
                },
                dataLabels: {
                    name: {
                        show: true,
                        fontSize: '18px',
                        color: '#333'
                    },
                    value: {
                        show: true,
                        fontSize: '24px',
                        color: '#333'
                    }
                }
            }
        },
        labels: ['汇率'],
        colors: ['#6BE675']
    };

    const [h1FontSize, setH1FontSize] = useState(32);
    const [pFontSize, setPFontSize] = useState(18);
    const [h2FontSize, setH2FontSize] = useState(28);
    const [h3FontSize, setH3FontSize] = useState(20);

    useEffect(() => {
        const handleResize = () => {
            const minH1Size = 32;
            const maxH1Size = 48;
            const h1CalculatedSize = (window.innerWidth * 0.05);
            setH1FontSize(Math.min(Math.max(h1CalculatedSize, minH1Size), maxH1Size));

            const minPSize = 18;
            const maxPSize = 22;
            const pCalculatedSize = (window.innerWidth * 0.025);
            setPFontSize(Math.min(Math.max(pCalculatedSize, minPSize), maxPSize));

            const minH2Size = 28;
            const maxH2Size = 36;
            const h2CalculatedSize = (window.innerWidth * 0.04);
            setH2FontSize(Math.min(Math.max(h2CalculatedSize, minH2Size), maxH2Size));

            const minH3Size = 20;
            const maxH3Size = 24;
            const h3CalculatedSize = (window.innerWidth * 0.03);
            setH3FontSize(Math.min(Math.max(h3CalculatedSize, minH3Size), maxH3Size));
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 源代码2中的数据可视化模块
    const data2 = [
        { name: '2020', cnt: 1200 },
        { name: '2021', cnt: 1300 },
        { name: '2022', cnt: 1100 },
        { name: '2023', cnt: 1400 },
    ];

    const option1 = {
        title: {
            text: '各关别进口商品总值分析',
            textStyle: {
                color: '#000'
            },
            borderWidth: 0,
            borderColor: 'blue',
            borderRadius: 0,
            left: 200,
            top: 0
        },
        tooltip: {
            trigger: 'axis',
            formatter: "{b} <br/>{a}: {c}"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            textStyle: {
                color: '#000'
            },
            data: data2.map(function (data) {
                return data.name;
            })
        },
        xAxis: {
            type: 'category',
            data: data2.map(function (data) {
                return data.name;
            }),
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                color: '#000',
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#000',
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#eee'
                }
            }
        },
        series: [
            {
                name: '进口总值',
                type: 'bar',
                itemStyle: {
                    color: '#339999'
                },
                data: data2.map(function (data) {
                    return data.cnt;
                })
            }
        ]
    };

    return (
        <motion.div
            className="container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                maxWidth: '1200px',
                margin: '30px auto',
                padding: '40px',
                backgroundColor: '#f9f9f9',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Inter, sans-serif',
                backgroundImage: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
            }}
        >
            {renderChart()}
            <EChartsComponent option={option1} />
        </motion.div>
    );
};

export default DataVisualization;