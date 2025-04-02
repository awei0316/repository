import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/register', user);
            window.location.href = '/login';
        } catch (error) {
            setError('注册失败，请检查输入信息');
        }
    };

    return (
        <div className="container register-container">
            <h1><FaUserPlus /> 注册</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="用户名"
                    required
                    className="input-field"
                />
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="邮箱"
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="密码"
                    required
                    className="input-field"
                />
                <button type="submit" className="btn register-btn">注册</button>
            </form>
        </div>
    );
};

export default Register;    