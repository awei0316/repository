import React, { useCallback, useState } from 'react';

const DebounceClick = ({ children, onClick, delay = 300 }) => {
    const [lastClickTime, setLastClickTime] = useState(0);

    const debouncedOnClick = useCallback(() => {
        const now = Date.now();
        if (now - lastClickTime > delay) {
            setLastClickTime(now);
            onClick();
        }
    }, [lastClickTime, delay, onClick]);

    return React.cloneElement(children, { onClick: debouncedOnClick });
};

export default DebounceClick;    