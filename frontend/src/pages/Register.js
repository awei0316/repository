// src/pages/Register.js
import React, { useState, useEffect, useRef } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PasswordVisibilityToggle from '../components/PasswordVisibilityToggle';
import { validatePhone, validatePassword } from '../utils/formValidation';

const Register = () => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const passwordRef = useRef(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        // 模拟发送验证码成功
        setError('');
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (validatePassword(newPassword)) {
            if (newPassword.length >= 12) {
                setPasswordStrength('强');
            } else if (newPassword.length >= 8) {
                setPasswordStrength('中');
            } else {
                setPasswordStrength('弱');
            }
        } else {
            setPasswordStrength('');
        }
    };

    const handleRegister = () => {
        if (!phone || !code || !password) {
            setError('请输入手机号码、验证码和密码');
            return;
        }
        if (!validatePhone(phone)) {
            setError('请输入有效的手机号码');
            return;
        }
        if (!validatePassword(password)) {
            setError('密码长度至少为6位');
            return;
        }
        // 模拟验证码验证成功
        if (code === '123456') {
            setError('');
            // 这里可添加注册成功后的跳转逻辑
            alert('注册成功');
        } else {
            setError('验证码错误');
        }
    };

    const handlePasswordVisibilityToggle = (visible) => {
        setIsPasswordVisible(visible);
    };

    return (
        <div className="container register-container">
            <h1>注册</h1>
            {error && <p className="error-message">{error}</p>}
            <InputField
                type="text"
                placeholder="请输入手机号码"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            <Button onClick={handleSendCode} disabled={countdown > 0} isCodeButton>
                {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
            </Button>
            <InputField
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
            />
            <div style={{ position: 'relative' }}>
                <InputField
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    ref={passwordRef}
                />
                <PasswordVisibilityToggle
                    inputRef={passwordRef}
                    onToggleVisibility={handlePasswordVisibilityToggle}
                />
                {passwordStrength && <p className="password-strength">{`密码强度: ${passwordStrength}`}</p>}
            </div>
            <Button onClick={handleRegister}>注册</Button>
        </div>
    );
};

export default Register;