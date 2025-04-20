// src/pages/Login.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { validatePhone } from '../utils/formValidation';
import PasswordVisibilityToggle from '../components/PasswordVisibilityToggle';
import CustomAlert from '../components/CustomAlert';

const Login = ({ setIsLoggedIn, setUserAvatar }) => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [isCodeLogin, setIsCodeLogin] = useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    const handleSendCode = () => {
        if (!validatePhone(phone)) {
            setError('请输入有效的手机号码');
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
                const userAvatar = 'https://example.com/avatar.jpg';
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userAvatar', userAvatar);
                setIsLoggedIn(true);
                setUserAvatar(userAvatar);
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    navigate('/');
                }, 2000);
            } else {
                setError('验证码错误');
            }
        } else {
            if (!phone || !password) {
                setError('请输入手机号码和密码');
                return;
            }
            if (password === '123456') {
                const userAvatar = 'https://example.com/avatar.jpg';
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userAvatar', userAvatar);
                setIsLoggedIn(true);
                setUserAvatar(userAvatar);
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    navigate('/');
                }, 2000);
            } else {
                setError('密码错误');
            }
        }
    };

    const toggleLoginMethod = () => {
        setIsCodeLogin(!isCodeLogin);
        setError('');
    };

    const handlePasswordVisibilityToggle = (visible) => {
        setIsPasswordVisible(visible);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
        navigate('/');
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
                <Button onClick={handleSendCode} disabled={countdown > 0} isCodeButton>
                    {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                </Button>
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
                    <Button onClick={handleLogin} className="login-btn">
                        登录
                    </Button>
                </div>
            )}
            {!isCodeLogin && (
                <div className="password-login">
                    <div style={{ position: 'relative' }}>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="请输入密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            ref={passwordRef}
                        />
                        <PasswordVisibilityToggle
                            inputRef={passwordRef}
                            onToggleVisibility={handlePasswordVisibilityToggle}
                        />
                    </div>
                    <Button onClick={handleLogin} className="login-btn">
                        登录
                    </Button>
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
            <CustomAlert
                message="登录成功"
                isVisible={showAlert}
                onClose={handleCloseAlert}
            />
        </div>
    );
};

export default Login;