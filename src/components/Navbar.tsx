import React from 'react';
import { Link } from 'react-router-dom';

// Import MobileMenu từ file vừa tạo
import MobileMenu from './MobileMenu';

const Navbar: React.FC = () => {
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

                    <div className="flex items-center">
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/list"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                一覧
                            </Link>
                            <Link
                                to="/login"
                                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                ログイン
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
