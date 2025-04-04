import React, { useState, useEffect } from 'react';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [isCodeLogin, setIsCodeLogin] = useState(true);

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
        setError('');
    };

    const handleLogin = () => {
        if (isCodeLogin) {
            if (!phone || !code) {
                setError('请输入手机号码和验证码');
                return;
            }
            if (code === '123456') {
                setError('');
                alert('登录成功');
            } else {
                setError('验证码错误');
            }
        } else {
            if (!phone || !password) {
                setError('请输入手机号码和密码');
                return;
            }
            if (password === '123456') {
                setError('');
                alert('登录成功');
            } else {
                setError('密码错误');
            }
        }
    };

    const toggleLoginMethod = () => {
        setIsCodeLogin(!isCodeLogin);
        setError('');
    };

    return (
        <div className="container login-container">
            <h1>登录</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="phone-input-group">
                <input
                    type="text"
                    placeholder="请输入手机号码"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                />
                <button
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="btn"
                >
                    {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                </button>
            </div>
            {isCodeLogin && (
                <div className="code-login">
                    <input
                        type="text"
                        placeholder="请输入验证码"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={handleLogin} className="btn login-btn">
                        登录
                    </button>
                </div>
            )}
            {!isCodeLogin && (
                <div className="password-login">
                    <input
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={handleLogin} className="btn login-btn">
                        登录
                    </button>
                </div>
            )}
            <div className="login-method-switch">
                <span
                    className={isCodeLogin ? 'active' : ''}
                    onClick={toggleLoginMethod}
                >
                    {isCodeLogin ? '使用密码登录' : '使用验证码登录'}
                </span>
            </div>
            <p>
                <a href="/forgotPassword">忘记密码?</a>
            </p>
        </div>
    );
};

export default Login;