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
                backgroundImage: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                perspective: '1000px'
            }}
        >
            <h1 style={{
                color: '#333',
                fontSize: `${h1FontSize}px`,
                fontWeight: '800',
                marginBottom: '15px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                letterSpacing: '1px',
                transform: 'translateZ(30px)'
            }}>数据可视化</h1>
            <p style={{
                color: '#666',
                fontSize: `${pFontSize}px`,
                marginBottom: '30px',
                textAlign: 'center',
                lineHeight: '1.5',
                transform: 'translateZ(20px)'
            }}>通过图表展示关键贸易指标</p>

            {/* 第一层：仪表盘 */}
            <div className="dashboard" style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                padding: '40px',
                marginBottom: '40px',
                position: 'relative',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(10px)'
            }}>
                <h2 style={{
                    color: '#333',
                    fontSize: `${h2FontSize}px`,
                    fontWeight: '700',
                    marginBottom: '30px',
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0.5px',
                    transform: 'translateZ(20px)'
                }}>动态仪表盘</h2>
                <div className="gauge-container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '30px',
                    flexWrap: 'wrap'
                }}>
                    <motion.div
                        style={{
                            width: 'calc(50% - 15px)',
                            minWidth: '250px',
                            backgroundColor: '#fff',
                            borderRadius: '20px',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                            padding: '30px',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            backgroundImage: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                            position: 'relative',
                            transformStyle: 'preserve-3d'
                        }}
                        whileHover={{ scale: 1.06, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)', rotateX: 5, rotateY: -5 }}
                    >
                        <h3 style={{
                            color: '#333',
                            fontSize: `${h3FontSize}px`,
                            fontWeight: '600',
                            marginBottom: '20px',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            letterSpacing: '0.3px',
                            transform: 'translateZ(10px)'
                        }}>贸易量</h3>
                        <Chart
                            options={tradeVolumeOptions}
                            series={[dashboardData.tradeVolume]}
                            type="radialBar"
                            height={250}
                        />
                    </motion.div>
                    <motion.div
                        style={{
                            width: 'calc(50% - 15px)',
                            minWidth: '250px',
                            backgroundColor: '#fff',
                            borderRadius: '20px',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                            padding: '30px',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            backgroundImage: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                            position: 'relative',
                            transformStyle: 'preserve-3d'
                        }}
                        whileHover={{ scale: 1.06, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)', rotateX: 5, rotateY: 5 }}
                    >
                        <h3 style={{
                            color: '#333',
                            fontSize: `${h3FontSize}px`,
                            fontWeight: '600',
                            marginBottom: '20px',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            letterSpacing: '0.3px',
                            transform: 'translateZ(10px)'
                        }}>汇率</h3>
                        <Chart
                            options={exchangeRateOptions}
                            series={[dashboardData.exchangeRate]}
                            type="radialBar"
                            height={250}
                        />
                    </motion.div>
                </div>
            </div>

            {/* 第二层：股票相关 */}
            <div className="stock-section" style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                padding: '40px',
                marginBottom: '40px',
                position: 'relative',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(10px)'
            }}>
                <h2 style={{
                    color: '#333',
                    fontSize: `${h2FontSize}px`,
                    fontWeight: '700',
                    marginBottom: '30px',
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0.5px',
                    transform: 'translateZ(20px)'
                }}>股票信息</h2>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '30px' 
                }}>
                    <StockLineChart data={dashboardData.stockPrices} />
                    <div className="stock-suggestions" style={{ width: '100%', maxWidth: '400px' }}>
                        <h3 style={{
                            color: '#333',
                            fontSize: `${h3FontSize}px`,
                            fontWeight: '600',
                            marginBottom: '15px',
                            textAlign: 'center',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            letterSpacing: '0.3px',
                            transform: 'translateZ(10px)'
                        }}>自选股建议</h3>
                        <ul style={{
                            listStyleType: 'none',
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            {dashboardData.stockPrices.map((stock, index) => (
                                <motion.li
                                    key={index}
                                    style={{
                                        color: '#666',
                                        fontSize: `${pFontSize}px`,
                                        marginBottom: '15px',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #eee',
                                        paddingBottom: '10px',
                                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        transformStyle: 'preserve-3d'
                                    }}
                                    whileHover={{ backgroundColor: '#f5f5f5', transform: 'translateX(10px) translateZ(10px)' }}
                                >
                                    <span>{stock.name}</span>
                                    <span style={{
                                        color: stock.change === 'up' ? '#6BE675' : '#FF6B6B',
                                        fontWeight: '600',
                                        transform: 'translateZ(10px)'
                                    }}>价格 {stock.price.toFixed(2)}，走势 {stock.change === 'up' ? '上涨' : '下跌'}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 第三层：切换图表类型和图表 */}
            <div className="chart-section" style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                padding: '40px',
                position: 'relative',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(10px)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '40px',
                    transform: 'translateZ(20px)'
                }}>
                    <select
                        onChange={handleYearChange}
                        value={selectedYear}
                        style={{
                            padding: '15px 20px',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: `${pFontSize}px`,
                            width: '100%',
                            maxWidth: '400px',
                            backgroundColor: '#fff',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                            transition: 'box-shadow 0.3s ease',
                            appearance: 'none',
                            backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'#666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>")',
                            backgroundRepeat: 'no-repeat',
                            backgroundPositionX: '95%',
                            backgroundPositionY: '50%',
                            transform: 'translateZ(10px)'
                        }}
                        onFocus={(e) => e.target.style.boxShadow = '0 5px 20px rgba(77, 150, 255, 0.3)' }
                        onBlur={(e) => e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)' }
                    >
                        <option value="">全部年份</option>
                        {data.map(item => (
                            <option key={item.name} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <motion.button
                        onClick={handleChartTypeChange}
                        style={{
                            padding: '15px 30px',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: `${pFontSize}px`,
                            backgroundColor: '#4D96FF',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 5px 15px rgba(77, 150, 255, 0.3)',
                            transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                            transform: 'translateZ(10px)'
                        }}
                        whileHover={{ backgroundColor: '#3A7BD5', boxShadow: '0 5px 20px rgba(77, 150, 255, 0.5)', scale: 1.05 }}
                    >
                        切换图表类型
                    </motion.button>
                </div>
                {renderChart()}
            </div>
        </motion.div>
    );
};

export default DataVisualization;
    