import React, { useState } from 'react';

const AIServiceIcon = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const showTooltip = () => {
        setIsTooltipVisible(true);
    };

    const hideTooltip = () => {
        setIsTooltipVisible(false);
    };

    const styles = {
        aiServiceIconContainer: {
            position: 'fixed',
            bottom: '80px',
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
        tooltip: {
            position: 'absolute',
            bottom: '70px',
            right: '0',
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            opacity: isTooltipVisible ? 1 : 0,
            visibility: isTooltipVisible ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
            whiteSpace: 'nowrap'
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
            // 修改为紫色
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
            // 横向布局
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
            // 修改为紫色
            backgroundColor: '#6f42c1', 
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        },
        chatInputButtonHover: {
            // 更深的紫色
            backgroundColor: '#5a32a3', 
        }
    };

    return (
        <div style={styles.aiServiceIconContainer}>
            <div
                style={{ ...styles.aiServiceIcon, ...(isChatOpen && styles.aiServiceIconHover) }}
                onMouseEnter={(e) => {
                    showTooltip();
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    hideTooltip();
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={toggleChat}
            >
                <img style={styles.aiServiceIconImg} src="/images/robot.jpg" alt="AI Service" />
            </div>
            {isTooltipVisible && <div style={styles.tooltip}>点击我，向我提问哦！</div>}
            {isChatOpen && (
                <div style={styles.aiChatBox}>
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
                        {/* 聊天消息显示区域 */}
                    </div>
                    <div style={styles.chatInput}>
                        <input
                            style={{
                                ...styles.chatInputInput,
                                ...(isChatOpen && styles.chatInputInputFocus)
                            }}
                            type="text"
                            placeholder="输入你的问题"
                        />
                        <button
                            style={{
                                ...styles.chatInputButton,
                                ...(isChatOpen && styles.chatInputButtonHover)
                            }}
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