import React from 'react';
import { FaDownload, FaFilter } from 'react-icons/fa';

const DataCollection = () => {
    return (
        <div className="container">
            <h1><FaDownload /> 数据收集</h1>
            <p>我们从政府机构、国际组织和商业数据库等广泛可靠的来源收集数据，确保数据的全面性和及时性。</p>
            <p><FaFilter /> 进行数据清洗和预处理，以确保数据质量和一致性。</p>
            <p>我们的数据来源涵盖宏观经济指标、贸易统计、市场价格、政策法规、财务报表和港口数据等多种信息。</p>
            <div className="image-container">
                <img src="https://dummyimage.com/1200x600/FFA500/ffffff&text=数据收集图片" alt="数据收集图片" />
            </div>
        </div>
    );
};

export default DataCollection;    