import React, { useEffect, useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserCircle, FaBirthdayCake, FaInfoCircle, FaHeart, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileDisplay = () => {
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
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        }
    }, []);

    const handleEditProfile = () => {
        navigate('/profile/edit');
    };

    return (
        <div className="container profile-container">
            <div className="profile-header">
                <div className="avatar-container">
                    <img
                        src={userInfo.avatar || 'https://via.placeholder.com/150'}
                        alt="Avatar"
                        className="avatar-img"
                    />
                </div>
                <div className="profile-info">
                    <h1><FaUser /> {userInfo.name}</h1>
                    <p>{userInfo.occupation}</p>
                </div>
            </div>
            <div className="profile-details">
                <div className="info-list">
                    <div className="info-item">
                        <FaPhone className="info-icon" />
                        <span>手机号码: {userInfo.phone}</span>
                    </div>
                    <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <span>邮箱: {userInfo.email}</span>
                    </div>
                    <div className="info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <span>地址: {userInfo.address}</span>
                    </div>
                    <div className="info-item">
                        <FaUserCircle className="info-icon" />
                        <span>性别: {userInfo.gender}</span>
                    </div>
                    <div className="info-item">
                        <FaBirthdayCake className="info-icon" />
                        <span>生日: {userInfo.birthday}</span>
                    </div>
                    <div className="info-item">
                        <FaInfoCircle className="info-icon" />
                        <span>个人简介: {userInfo.bio}</span>
                    </div>
                    <div className="info-item">
                        <FaHeart className="info-icon" />
                        <span>兴趣爱好: {userInfo.hobbies}</span>
                    </div>
                    <div className="info-item">
                        <FaGlobe className="info-icon" />
                        <span>社交账号: {userInfo.socialMedia}</span>
                    </div>
                </div>
            </div>
            <button onClick={handleEditProfile} className="btn">修改个人信息</button>
        </div>
    );
};

export default ProfileDisplay;