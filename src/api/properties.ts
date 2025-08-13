import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProperty = async () => {
    const res = await axios.get(`${API_URL}/properties`);
    return res.data?.data || null;
};
export const fetchPropertyDetail = async (id: string) => {
    const res = await axios.get(`${API_URL}/properties/${id}`);
    return res.data?.data || null;
};

export const updateProperty = async ({ id, data }: { id: string; data: FormData }) => {
    const res = await axios.post(`${API_URL}/properties/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const createPageApi = async ({ data }: { data: FormData }) => {
    const res = await axios.post(`${API_URL}/properties`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
};
