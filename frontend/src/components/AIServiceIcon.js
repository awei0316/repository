import React, { useState, useEffect, useRef } from 'react';
import './AIServiceIcon.css';

const AIServiceIcon = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [partialResponse, setPartialResponse] = useState('');
    const containerRef = useRef(null);
    const chatHeaderRef = useRef(null);

    // 拖动相关状态
    const [isDragging, setIsDragging] = useState(false);
    const [initialX, setInitialX] = useState(0);
    const [initialY, setInitialY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    // 新增标志位，用于判断是否是拖动后触发的点击
    const [isDragEndClick, setIsDragEndClick] = useState(false);
    // 记录鼠标按下和抬起时的位置，用于判断是否有移动
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const MOVE_THRESHOLD = 5; // 移动阈值，判断是否为拖动操作
    // 新增最大化状态
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsChatOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleChat = () => {
        // 如果是拖动后触发的点击，不执行切换聊天框操作
        if (isDragEndClick) {
            setIsDragEndClick(false);
            return;
        }
        setIsChatOpen(!isChatOpen);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;
        const newMessage = { text: inputValue, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInputValue('');
        setPartialResponse('');

        const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY; // 使用环境变量

        try {
            console.log('开始发送请求');
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    "model": "deepseek-chat",
                    "messages": [
                        ...messages.map((msg) => ({
                            role: msg.sender === 'user' ? 'user' : 'assistant',
                            content: msg.text
                        })),
                        { role: 'user', content: inputValue }
                    ],
                    "stream": false
                })
            });

            if (!response.ok) {
                throw new Error(`请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            const aiMessage = { text: aiResponse, sender: 'ai' };
            setMessages([...messages, newMessage, aiMessage]);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            const errorMessage = { text: '抱歉，出现错误，请稍后再试。', sender: 'ai' };
            setMessages([...messages, newMessage, errorMessage]);
        }
    };

    const userAvatar = localStorage.getItem('userAvatar') || 'https://via.placeholder.com/50';
    const robotAvatar = '/images/robot.jpg'; // 机器人头像地址

    const handleMouseDown = (e) => {
        if (chatHeaderRef.current && chatHeaderRef.current.contains(e.target)) {
            setIsDragging(true);
            setInitialX(e.clientX);
            setInitialY(e.clientY);
            setStartX(e.clientX);
            setStartY(e.clientY);
            e.preventDefault(); // 阻止默认的拖动行为
        } else if (e.target.closest('.ai-service-icon')) {
            // 允许拖动小机器人图标
            setIsDragging(true);
            setInitialX(e.clientX);
            setInitialY(e.clientY);
            setStartX(e.clientX);
            setStartY(e.clientY);
            e.preventDefault();
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;
            setOffsetX(offsetX + dx);
            setOffsetY(offsetY + dy);
            setInitialX(e.clientX);
            setInitialY(e.clientY);
        }
    };

    const handleMouseUp = (e) => {
        const endX = e.clientX;
        const endY = e.clientY;
        const movedX = Math.abs(endX - startX);
        const movedY = Math.abs(endY - startY);

        if (movedX > MOVE_THRESHOLD || movedY > MOVE_THRESHOLD) {
            setIsDragEndClick(true);
        } else {
            setIsDragEndClick(false);
        }

        setIsDragging(false);
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className={`ai-service-container ${isDragging ? `dragging` : ``}`} ref={containerRef} onMouseDown={handleMouseDown} style={{ "--offset-x": `${offsetX}px`, "--offset-y": `${offsetY}px` }}>
            <div
                className="ai-service-icon"
                onClick={toggleChat}
            >
                <img src={robotAvatar} alt="AI Service" className="ai-service-icon-img" />
            </div>
            {isChatOpen && (
                <div className={`ai-chat-box ${isChatOpen ? 'show' : ''} ${isMaximized ? 'maximized' : ''}`}>
                    <div className={`chat-header ${isMaximized ? 'maximized' : ''}`} ref={chatHeaderRef}>
                        <h3>AI助手</h3>
                        <div className="button-container">
                            <button
                                className="chat-header-button maximize-button"
                                onClick={toggleMaximize}
                            >
                                {isMaximized ? '🗗' : '🗖'}
                            </button>
                            <button
                                className="chat-header-button close-button"
                                onClick={() => setIsChatOpen(false)}
                            >
                                ✖
                            </button>
                        </div>
                    </div>
                    <div className={`chat-messages ${isMaximized ? 'maximized' : ''}`}>
                        {messages.map((message, index) => (
                            <div key={index} className="message-container">
                                {message.sender === 'user' ? (
                                    <>
                                        <div className="user-message">
                                            {message.text}
                                            <div className="user-message-arrow" />
                                        </div>
                                        <img src={userAvatar} alt="User" className="user-avatar" />
                                    </>
                                ) : (
                                    <>
                                        <img src={robotAvatar} alt="Robot" className="robot-avatar" />
                                        <div className="ai-message">
                                            {message.text}
                                            <div className="ai-message-arrow" />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={`chat-input ${isMaximized ? 'maximized' : ''}`}>
                        <input
                            className="chat-input-input"
                            type="text"
                            placeholder="输入你的问题"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="chat-input-button"
                            onClick={handleSendMessage}
                        >
                            发送
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIServiceIcon;