// src/components/EChartsComponent.js
import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const EChartsComponent = ({ option, height = 400 }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const myChart = echarts.init(chartRef.current);
        myChart.setOption(option);

        const resizeHandler = () => myChart.resize();
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
            myChart.dispose();
        };
    }, [option]);

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default EChartsComponent;