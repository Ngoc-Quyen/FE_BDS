import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi } from '../../api/auth';

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            const token = data?.data?.token;
            const user = data?.data?.user || {};
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('name', user.name || '');
                localStorage.setItem('email', user.email || '');
                queryClient.invalidateQueries({ queryKey: ['auth'] });
                navigate('/');
            } else {
                setError('Login Fail!');
            }
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Login Fail!');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        mutation.mutate({ email, password });
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">ログイン</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm text-gray-600">メール</label>
                    <input
                        className="mt-1 block w-full border rounded px-3 py-2"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">パスワード</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="mt-1 block w-full border rounded px-3 py-2 pr-10"
                            placeholder="●●●●●"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'ログインしています...' : 'ログイン'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
