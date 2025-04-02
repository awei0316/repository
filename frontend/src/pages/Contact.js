import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Contact = () => {
    return (
        <div className="container">
            <h1><FaEnvelope /> 联系我们</h1>
            <form>
                <InputField type="text" placeholder="请输入您的姓名" required />
                <InputField type="email" placeholder="请输入您的邮箱" required />
                <InputField type="textarea" placeholder="请输入您的留言" required />
                <Button type="submit">提交</Button>
            </form>
        </div>
    );
};

export default Contact;    