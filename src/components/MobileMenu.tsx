import React from 'react';
import { Link } from 'react-router-dom';

const MobileMenu: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-expanded={open}
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1">
                    <Link to="/list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Danh sách
                    </Link>
                    <Link to="/login" className="block px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        Đăng nhập
                    </Link>
                </div>
            )}
        </div>
    );
};

// Export component để các file khác có thể import
export default MobileMenu;
