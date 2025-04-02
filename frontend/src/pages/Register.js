import React, { useState, useRef } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { validateEmail, validatePassword } from '@utils/formValidation';
import { sanitizeInput } from '@utils/sanitizeInput';
import PasswordVisibilityToggle from '../components/PasswordVisibilityToggle';

const Register = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const passwordRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validateEmail(user.email)) {
            setError('请输入有效的邮箱地址');
            setLoading(false);
            return;
        }
        if (!validatePassword(user.password)) {
            setError('密码长度至少为 6 位');
            setLoading(false);
            return;
        }
        try {
            const sanitizedUser = {
                username: sanitizeInput(user.username),
                email: sanitizeInput(user.email),
                password: sanitizeInput(user.password)
            };
            await axios.post('/api/register', sanitizedUser);
            window.location.href = '/login';
        } catch (error) {
            setError('注册失败，请检查输入信息');
        } finally {
            setLoading(false);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    return (
        <div className="container register-container">
            <h1><FaUserPlus /> 注册</h1>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleRegister}>
                <InputField
                    type="text"
                    name="username"
                    placeholder="请输入用户名"
                    value={user.username}
                    onChange={handleChange}
                    required
                />
                <InputField
                    type="email"
                    name="email"
                    placeholder="请输入邮箱"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <div style={{ position: 'relative' }}>
                    <InputField
                        type="password"
                        name="password"
                        placeholder="请输入密码"
                        value={user.password}
                        onChange={handleChange}
                        required
                        ref={passwordRef}
                    />
                    <PasswordVisibilityToggle inputRef={passwordRef} />
                </div>
                <Button type="submit" className="register-btn" loading={loading}>注册</Button>
            </form>
        </div>
    );
};

export default Register;