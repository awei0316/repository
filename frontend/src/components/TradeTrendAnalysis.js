// src/components/TradeTrendAnalysis.js
import React, { useEffect, useState } from 'react';
import ReactEcharts from 'react-echarts';
import { fetchTradeTrendData } from '../services/dataService';

const TradeTrendAnalysis = () => {
  const [data, setData] = useState({ years: [], values: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTradeTrendData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const option = {
    title: {
      text: '进出口贸易额趋势分析',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      data: data.years
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '进出口贸易额',
        type: 'line',
        data: data.values,
        areaStyle: {}
      }
    ]
  };

  return <ReactEcharts option={option} />;
};

export default TradeTrendAnalysis;