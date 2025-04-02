import React, { useState, useRef } from 'react';
import { FaUserLock } from 'react-icons/fa';
import axios from 'axios';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import PasswordVisibilityToggle from '../components/PasswordVisibilityToggle';
import { sanitizeInput } from '../utils/sanitizeInput';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const passwordRef = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const sanitizedUsername = sanitizeInput(username);
            const sanitizedPassword = sanitizeInput(password);
            const response = await axios.post('/api/login', { username: sanitizedUsername, password: sanitizedPassword });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (error) {
            setError('登录失败，请检查用户名和密码');
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container login-container">
            <h1><FaUserLock /> 登录</h1>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleLogin}>
                <InputField
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <div style={{ position: 'relative' }}>
                    <InputField
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        ref={passwordRef}
                    />
                    <PasswordVisibilityToggle inputRef={passwordRef} />
                </div>
                <Button type="submit" className="login-btn" loading={loading}>登录</Button>
            </form>
        </div>
    );
};

export default Login;    