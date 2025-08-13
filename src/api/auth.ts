import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const loginApi = async (data: { email: string; password: string }) => {
    const res = await axios.post(`${API_URL}/login`, data);
    return res.data;
};

export const logoutApi = async () => {
    return axios.post(
        `${API_URL}/logout`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
};

export const getAuthData = async () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    return { token, name, email };
};
