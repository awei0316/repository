// repository/frontend/src/components/BottomInfo.js
import React, { useState, useEffect } from 'react';

const BottomInfo = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setIsVisible(true);
                // 当滚动到底部时，给底部信息添加 show 类
                document.querySelector('.bottom-info-container').classList.add('show'); 
            } else {
                setIsVisible(false);
                // 当离开底部时，移除底部信息的 show 类
                document.querySelector('.bottom-info-container').classList.remove('show'); 
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`bottom-info-container ${isVisible ? 'show' : ''}`}>
            <div className="bottom-info-left">
                <div>
                    <h3>客户服务</h3>
                    <p>客服热线：0351-7021781</p>
                </div>
            </div>
            <div className="bottom-info-copyright">
                <p>版权所有©️ 河北工程大学</p>
                <p>冀公网安备 3415535123525号 | 工信部备案号：冀ICP备312314115号-5</p>
            </div>
        </div>
    );
};

export default BottomInfo;