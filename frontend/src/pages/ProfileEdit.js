import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake, FaUserCircle, FaInfoCircle, FaHeart, FaGlobe } from 'react-icons/fa';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { validatePhone, validateEmail } from '../utils/formValidation';

const ProfileEdit = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        phone: '',
        email: '',
        avatar: '',
        address: '',
        occupation: '',
        gender: '',
        birthday: '',
        bio: '',
        hobbies: '',
        socialMedia: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
        const storedUserAvatar = localStorage.getItem('userAvatar');
        if (storedUserAvatar) {
            setUserInfo(prevInfo => ({
                ...prevInfo,
                avatar: storedUserAvatar
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
        validateField(name, value);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo(prevInfo => ({
                    ...prevInfo,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'phone':
                if (!validatePhone(value)) {
                    error = '请输入有效的手机号码';
                }
                break;
            case 'email':
                if (!validateEmail(value)) {
                    error = '请输入有效的邮箱地址';
                }
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: error
        }));
    };

    const handleSaveInfo = () => {
        let newErrors = {};
        Object.keys(userInfo).forEach(field => {
            validateField(field, userInfo[field]);
            if (errors[field]) {
                newErrors[field] = errors[field];
            }
        });
        if (Object.keys(newErrors).length === 0) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('userAvatar', userInfo.avatar);
            alert('个人信息保存成功');
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="container profile-container">
            <h1><FaUser /> 编辑个人信息</h1>
            <div className="avatar-container">
                <img
                    src={userInfo.avatar || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    className="avatar-img"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                />
            </div>
            <div className="input-list">
                <div className="input-group">
                    <FaUser className="input-icon" />
                    <InputField
                        type="text"
                        placeholder="请输入您的姓名"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                    />
                </div>
                {errors.name && <p className="error-message">{errors.name}</p>}
                <div className="input-group">
                    <FaPhone className="input-icon" />
                    <InputField
                        type="text"
                        placeholder="请输入您的手机号码"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleInputChange}
                    />
                </div>
                {errors.phone && <p className="error-message">{errors.phone}</p>}
                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <InputField
                        type="email"
                        placeholder="请输入您的邮箱"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                    />
                </div>
                {errors.email && <p className="error-message">{errors.email}</p>}
                <div className="input-group">
                    <FaMapMarkerAlt className="input-icon" />
                    <InputField
                        type="text"
                        placeholder="请输入您的地址"
                        name="address"
                        value={userInfo.address}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <FaUserCircle className="input-icon" />
                    <InputField
                        type="text"
                        placeholder="请输入您的职业"
                        name="occupation"
                        value={userInfo.occupation}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <FaUserCircle className="input-icon" />
                    <InputField
                        type="text"
                        placeholder="请输入您的性别"
                        name="gender"
                        value={userInfo.gender}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <FaBirthdayCake className="input-icon" />
                    <InputField
                        type="date"
                        placeholder="请输入您的生日"
                        name="birthday"
                        value={userInfo.birthday}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <FaInfoCircle className="input-icon" />
                    <InputField
                        type="textarea"
                        placeholder="请输入您的个人简介"
                        name="bio"
                        value={userInfo.bio}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <FaHeart className="input-icon" />
                    <InputField
                        type="text"
                        placeholder="请输入您的兴趣爱好"
                        name="hobbies"
                        value={userInfo.hobbies}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <FaGlobe className="input-icon" />
                    <InputField
                        type="text"
                        placeholder="请输入您的社交账号"
                        name="socialMedia"
                        value={userInfo.socialMedia}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <Button onClick={handleSaveInfo}>保存信息</Button>
        </div>
    );
};

export default ProfileEdit;