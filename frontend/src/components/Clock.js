// repository/frontend/src/components/Clock.js
import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const options = {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const formattedTime = currentTime.toLocaleTimeString('zh-CN', options);

    return (
        <span style={{ color: 'white', marginRight: '20px' }}>
            {formattedTime}
        </span>
    );
};

export default Clock;