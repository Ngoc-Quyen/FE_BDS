import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">ロギング</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600">メール</label>
                    <input className="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">パスワード</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="mt-1 block w-full border rounded px-3 py-2 pr-10" // pr-10 để chừa chỗ icon
                            placeholder="●●●●●"
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
                <div className="flex justify-end">
                    <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded">
                        ロギング
                    </button>
                </div>
            </form>
        </div>
    );
};
export default LoginPage;
