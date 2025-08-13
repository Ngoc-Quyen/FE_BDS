import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuthData, logoutApi } from '../api/auth';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: auth } = useQuery({
        queryKey: ['auth'],
        queryFn: getAuthData,
    });

    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSettled: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            navigate('/login');
        },
    });

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold">
                                NQ
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-semibold text-lg">CRUD-BDS</span>
                                <div className="text-xs text-gray-500">資産管理</div>
                            </div>
                        </Link>
                    </div>
                    <div className="flex gap-4 items-center">
                        {auth?.token && auth?.name ? (
                            <>
                                <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100">
                                    {auth.name}
                                </span>
                                <button
                                    onClick={() => logoutMutation.mutate()}
                                    className="px-3 py-2 bg-red-500 text-white rounded"
                                >
                                    ログアウト
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex gap-4">
                                    <Link
                                        to="/list"
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        一覧
                                    </Link>
                                </div>
                                <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded">
                                    ログイン
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
