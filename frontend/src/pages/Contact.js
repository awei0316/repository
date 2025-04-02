import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="container">
            <h1><FaEnvelope /> 联系我们</h1>
            <form>
                <input type="text" placeholder="姓名" required className="input-field" />
                <input type="email" placeholder="邮箱" required className="input-field" />
                <textarea placeholder="留言" required className="input-field"></textarea>
                <button type="submit" className="btn">提交</button>
            </form>
        </div>
    );
};

export default Contact;    