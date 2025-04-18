// src/pages/ForgotPassword.js
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import PasswordVisibilityToggle from '../components/PasswordVisibilityToggle';

const ForgotPassword = () => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const passwordRef = useRef(null);

    const handleSendCode = () => {
        if (!phone) {
            setError('请输入手机号码');
            return;
        }
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
            if (prev === 0) {
                clearInterval(timer);
            }
        }, 1000);
        // 模拟发送验证码成功
        setError('');
    };

    const handleResetPassword = () => {
        if (!phone || !code || !newPassword) {
            setError('请输入手机号码、验证码和新密码');
            return;
        }
        // 模拟验证码验证成功
        if (code === '123456') {
            setError('');
            // 这里可添加重置密码成功后的跳转逻辑
            alert('重置密码成功');
        } else {
            setError('验证码错误');
        }
    };

    const handlePasswordVisibilityToggle = (visible) => {
        setIsPasswordVisible(visible);
    };

    return (
        <div className="container forgot-password-container">
            <h1>忘记密码</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="请输入手机号码"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleSendCode} disabled={countdown > 0} isCodeButton>
                {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
            </Button>
            <input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <div style={{ position: 'relative' }}>
                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="请输入新密码"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    ref={passwordRef}
                />
                <PasswordVisibilityToggle
                    inputRef={passwordRef}
                    onToggleVisibility={handlePasswordVisibilityToggle}
                />
            </div>
            <Button onClick={handleResetPassword}>重置密码</Button>
        </div>
    );
};

export default ForgotPassword;