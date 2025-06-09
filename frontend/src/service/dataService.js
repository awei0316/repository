// src/services/dataService.js
const API_BASE_URL = 'http://localhost:5000/api/data';

export const fetchTradeTrendData = async () => {
  const response = await fetch(`${API_BASE_URL}/trade-trend`);
  return response.json();
};

export const fetchCustomsRankData = async () => {
  const response = await fetch(`${API_BASE_URL}/customs-rank`);
  return response.json();
};

// 为其他图表添加类似的 fetch 函数...