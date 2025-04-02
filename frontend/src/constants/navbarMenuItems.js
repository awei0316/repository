import { FaHome, FaDatabase, FaChartBar, FaChartLine, FaUsers, FaRobot } from 'react-icons/fa';

const navbarMenuItems = [
    { path: '/', icon: <FaHome />, label: '首页' },
    { path: '/data-collection', icon: <FaDatabase />, label: '数据收集' },
    { path: '/data-visualization', icon: <FaChartBar />, label: '数据可视化' },
    { path: '/sales-prediction', icon: <FaChartLine />, label: '销售预测' },
    { path: '/user-community', icon: <FaUsers />, label: '用户社区' },
    { path: '/ai-services', icon: <FaRobot />, label: 'AI服务' }
];

export default navbarMenuItems;    