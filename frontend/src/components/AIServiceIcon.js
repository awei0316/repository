import React, { useState } from 'react';

const AIServiceIcon = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
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
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
        },
        aiServiceIconHover: {
            transform: 'scale(1.1)'
        },
        aiServiceIconImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
        },
        aiChatBox: {
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '300px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
        },
        chatHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#f0f0f0'
        },
        chatHeaderH3: {
            margin: 0
        },
        chatHeaderButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px'
        },
        chatMessages: {
            padding: '10px',
            height: '200px',
            overflowY: 'auto'
        },
        chatInput: {
            display: 'flex',
            padding: '10px',
            borderTop: '1px solid #f0f0f0'
        },
        chatInputInput: {
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
        },
        chatInputButton: {
            marginLeft: '10px',
            padding: '8px 16px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.aiServiceIconContainer}>
            <div
                style={{ ...styles.aiServiceIcon, ...(isChatOpen && styles.aiServiceIconHover) }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={toggleChat}
            >
                <img style={styles.aiServiceIconImg} src="D:\develop\UniTrade\frontend\public\images\robot.jpg" alt="AI Service" />
            </div>
            {isChatOpen && (
                <div style={styles.aiChatBox}>
                    <div style={styles.chatHeader}>
                        <h3 style={styles.chatHeaderH3}>AI 服务聊天</h3>
                        <button style={styles.chatHeaderButton} onClick={toggleChat}>关闭</button>
                    </div>
                    <div style={styles.chatMessages}>
                        {/* 聊天消息显示区域 */}
                    </div>
                    <div style={styles.chatInput}>
                        <input style={styles.chatInputInput} type="text" placeholder="输入你的问题" />
                        <button style={styles.chatInputButton}>发送</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIServiceIcon;