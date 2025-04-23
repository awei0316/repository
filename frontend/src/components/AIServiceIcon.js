import React, { useState, useEffect, useRef } from 'react';
import './AIServiceIcon.css';

const AIServiceIcon = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [partialResponse, setPartialResponse] = useState('');
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);
    const chatHeaderRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const abortControllerRef = useRef(null);

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
        setIsLoading(true);
        setShowScrollIndicator(true);

        const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY; // 使用环境变量
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

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
                    "stream": true // 开启流式响应
                }),
                signal
            });

            if (!response.ok) {
                throw new Error(`请求失败，状态码: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    const jsonPart = line.replace(/^data: /, '');
                    if (jsonPart === '[DONE]') break;
                    try {
                        const data = JSON.parse(jsonPart);
                        const delta = data.choices[0].delta.content;
                        if (delta) {
                            fullResponse += delta;
                            setPartialResponse(fullResponse);
                        }
                    } catch (error) {
                        console.error('解析流式响应出错:', error);
                    }
                }
            }

            const aiMessage = { text: fullResponse, sender: 'ai' };
            setMessages([...messages, newMessage, aiMessage]);
            setPartialResponse('');
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('请求已停止');
            } else {
                console.error('Error fetching AI response:', error);
                const errorMessage = { text: '抱歉，出现错误，请稍后再试。', sender: 'ai' };
                setMessages([...messages, newMessage, errorMessage]);
            }
        } finally {
            setIsLoading(false);
            // 当请求完成后，检查是否滚动到底部
            if (chatMessagesRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
                if (scrollTop + clientHeight >= scrollHeight) {
                    setShowScrollIndicator(false);
                }
            }
        }
    };

    const handleStopRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsLoading(false);
            // 停止请求时，检查是否滚动到底部
            if (chatMessagesRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
                if (scrollTop + clientHeight >= scrollHeight) {
                    setShowScrollIndicator(false);
                }
            }
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

    const handleScrollDown = () => {
        if (chatMessagesRef.current) {
            // 平滑滚动到页面底部
            chatMessagesRef.current.scrollTo({
                top: chatMessagesRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // 优化滚动逻辑和判断向下箭头显示逻辑
    useEffect(() => {
        if (chatMessagesRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
            // 检查是否滚动到接近底部
            if (scrollTop + clientHeight < scrollHeight) {
                setShowScrollIndicator(true);
            } else {
                setShowScrollIndicator(false);
            }
        }
    }, [messages, partialResponse]);

    // 监听滚动事件，实时更新向下箭头显示状态
    useEffect(() => {
        const handleScroll = () => {
            if (chatMessagesRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
                if (scrollTop + clientHeight < scrollHeight) {
                    setShowScrollIndicator(true);
                } else {
                    setShowScrollIndicator(false);
                }
            }
        };

        if (chatMessagesRef.current) {
            chatMessagesRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (chatMessagesRef.current) {
                chatMessagesRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

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
                    <div className={`chat-messages ${isMaximized ? 'maximized' : ''}`} ref={chatMessagesRef}>
                        {messages.map((message, index) => (
                            <div key={index} className="message-container">
                                {message.sender === 'user' ? (
                                    <>
                                        <img src={userAvatar} alt="User" className="user-avatar" />
                                        <div className="user-message">
                                            {message.text}
                                            <div className="user-message-arrow" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img src={robotAvatar} alt="Robot" className="robot-avatar" />
                                        <div className="ai-message">
                                            {message.text.split('\n').map((paragraph, paraIndex) => {
                                                // 简单判断小标题，假设以数字加.开头为小标题
                                                const isHeading = /^\d+\./.test(paragraph);
                                                return isHeading ? (
                                                    <p key={paraIndex} style={{ fontWeight: 'bold' }}>{paragraph}</p>
                                                ) : (
                                                    <p key={paraIndex}>{paragraph}</p>
                                                );
                                            })}
                                            <div className="ai-message-arrow" />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        {partialResponse && (
                            <div className="message-container">
                                <img src={robotAvatar} alt="Robot" className="robot-avatar" />
                                <div className="ai-message">
                                    {partialResponse.split('\n').map((paragraph, paraIndex) => {
                                        const isHeading = /^\d+\./.test(paragraph);
                                        return isHeading ? (
                                            <p key={paraIndex} style={{ fontWeight: 'bold' }}>{paragraph}</p>
                                        ) : (
                                            <p key={paraIndex}>{paragraph}</p>
                                        );
                                    })}
                                    <div className="ai-message-arrow" />
                                </div>
                            </div>
                        )}
                    </div>
                    {showScrollIndicator && (
                        <div className="scroll-indicator" onClick={handleScrollDown}>
                            <div className={`circle ${isLoading ? 'loading' : ''}`}>
                                {isLoading ? (
                                    <span className="spinner"></span>
                                ) : (
                                    <span className="arrow-down">↓</span>
                                )}
                            </div>
                        </div>
                    )}
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
                            onClick={isLoading ? handleStopRequest : handleSendMessage}
                        >
                            {isLoading ? '停止' : '发送'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIServiceIcon;