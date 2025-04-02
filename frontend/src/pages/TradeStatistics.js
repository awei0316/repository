import React from 'react';
import { FaChartBar } from 'react-icons/fa';

const TradeStatistics = () => {
    return (
        <div className="container">
            <h1><FaChartBar /> 贸易统计</h1>
            <p>展示全球贸易数据统计</p>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>国家</th>
                            <th>进口额</th>
                            <th>出口额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>中国</td>
                            <td>1200亿</td>
                            <td>1500亿</td>
                        </tr>
                        <tr>
                            <td>美国</td>
                            <td>1000亿</td>
                            <td>1400亿</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TradeStatistics;    