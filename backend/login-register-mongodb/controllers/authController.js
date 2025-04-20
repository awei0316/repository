const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 注册用户
const registerUser = async (req, res) => {
    const { phone, password, code } = req.body;

    try {
        // 检查用户是否已存在
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ message: '该手机号码已注册' });
        }

        // 创建新用户
        const user = await User.create({
            phone,
            password,
            code
        });

        // 生成 JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            phone: user.phone,
            token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 用户登录
const loginUser = async (req, res) => {
    const { phone, password, code, isCodeLogin } = req.body;

    try {
        if (isCodeLogin) {
            // 验证码登录
            const user = await User.findOne({ phone, code });
            if (!user) {
                return res.status(400).json({ message: '验证码错误或用户不存在' });
            }
        } else {
            // 密码登录
            const user = await User.findOne({ phone });
            if (user && (await user.matchPassword(password))) {
                // 生成 JWT token
                const token = generateToken(user._id);
                res.json({
                    _id: user._id,
                    phone: user.phone,
                    token
                });
            } else {
                res.status(400).json({ message: '手机号码或密码错误' });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 生成 JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, 'your_secret_key', {
        expiresIn: '30d'
    });
};

module.exports = {
    registerUser,
    loginUser
};