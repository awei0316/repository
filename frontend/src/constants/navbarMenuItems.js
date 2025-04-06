// src/constants/navbarMenuItems.js
import { FaHome, FaChartBar, FaChartLine, FaUsers } from 'react-icons/fa';

const navbarMenuItems = [
    { path: '/', icon: <FaHome />, label: '首页' },
    { path: '/data-visualization', icon: <FaChartBar />, label: '数据可视化' },
    { path: '/sales-prediction', icon: <FaChartLine />, label: '销售预测' },
    { path: '/user-community', icon: <FaUsers />, label: '用户社区' },
];

export default navbarMenuItems;