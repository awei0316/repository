// src/utils/formValidation.js
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validatePhone = (phone) => {
    const re = /^1[3-9]\d{9}$/;
    return re.test(phone);
};