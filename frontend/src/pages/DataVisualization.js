import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { memo } from 'react';

const Chart = memo(({ data }) => (
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

const DataVisualization = () => {
    const data = useMemo(() => [
        { name: '2020', imports: 1200, exports: 1500 },
        { name: '2021', imports: 1300, exports: 1600 },
        { name: '2022', imports: 1100, exports: 1400 },
        { name: '2023', imports: 1400, exports: 1700 },
    ], []);

    return (
        <div className="container">
            <h1>数据可视化</h1>
            <p>通过图表展示关键贸易指标</p>
            <Chart data={data} />
        </div>
    );
};

export default DataVisualization;    