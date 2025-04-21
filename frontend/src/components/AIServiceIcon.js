// AIServiceIcon.js
import React, { useState, useEffect, useRef } from 'react';

const AIServiceIcon = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [partialResponse, setPartialResponse] = useState('');
    const chatBoxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
                setIsChatOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleChat = () => {
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

    const styles = {
        aiServiceIconContainer: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
        },
        aiServiceIcon: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        aiServiceIconHover: {
            transform: 'scale(1.1)'
        },
        aiServiceIconImg: {
            width: '80%',
            height: '80%',
            objectFit: 'cover',
            borderRadius: '50%'
        },
        aiChatBox: {
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '300px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transform: isChatOpen ? 'scale(1)' : 'scale(0.9)',
            opacity: isChatOpen ? 1 : 0,
            visibility: isChatOpen ? 'visible' : 'hidden',
            transition: 'transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease'
        },
        chatHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: '#6f42c1',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
        },
        chatHeaderH3: {
            margin: 0
        },
        chatHeaderButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: 'white',
            transition: 'color 0.3s ease'
        },
        chatHeaderButtonHover: {
            color: '#e0e0e0'
        },
        chatMessages: {
            padding: '15px',
            height: '200px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9f9f9'
        },
        chatInput: {
            display: 'flex',
            padding: '15px',
            borderTop: '1px solid #e0e0e0',
            flexDirection: 'row',
            alignItems: 'center'
        },
        chatInputInput: {
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '14px',
            transition: 'border-color 0.3s ease'
        },
        chatInputInputFocus: {
            borderColor: '#6f42c1'
        },
        chatInputButton: {
            marginLeft: '10px',
            padding: '10px 20px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        },
        chatInputButtonHover: {
            backgroundColor: '#5a32a3'
        },
        userMessage: {
            alignSelf: 'flex-end',
            backgroundColor: '#6f42c1',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '8px'
        },
        aiMessage: {
            alignSelf: 'flex-start',
            backgroundColor: '#e0e0e0',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '8px'
        }
    };

    return (
        <div style={styles.aiServiceIconContainer}>
            <div
                style={{ ...styles.aiServiceIcon, ...(isChatOpen && styles.aiServiceIconHover) }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={toggleChat}
            >
                <img style={styles.aiServiceIconImg} src="/images/robot.jpg" alt="AI Service" />
            </div>
            {isChatOpen && (
                <div style={styles.aiChatBox} ref={chatBoxRef}>
                    <div style={styles.chatHeader}>
                        <h3 style={styles.chatHeaderH3}>AI 服务聊天</h3>
                        <button
                            style={{
                                ...styles.chatHeaderButton,
                                ...(isChatOpen && styles.chatHeaderButtonHover)
                            }}
                            onClick={toggleChat}
                        >
                            关闭
                        </button>
                    </div>
                    <div style={styles.chatMessages}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={message.sender === 'user' ? styles.userMessage : styles.aiMessage}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div style={styles.chatInput}>
                        <input
                            style={{
                                ...styles.chatInputInput,
                                ...(isChatOpen && styles.chatInputInputFocus)
                            }}
                            type="text"
                            placeholder="输入你的问题"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                        <button
                            style={{
                                ...styles.chatInputButton,
                                ...(isChatOpen && styles.chatInputButtonHover)
                            }}
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