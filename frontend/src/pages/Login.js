import React, { useState } from 'react';
import { FaUserLock } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { username, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (error) {
            setError('登录失败，请检查用户名和密码');
        }
    };

    return (
        <div className="container login-container">
            <h1><FaUserLock /> 登录</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="用户名"
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="密码"
                    required
                    className="input-field"
                />
                <button type="submit" className="btn login-btn">登录</button>
            </form>
        </div>
    );
};

export default Login;    