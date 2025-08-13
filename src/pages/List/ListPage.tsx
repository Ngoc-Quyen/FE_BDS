import React, { useState } from 'react';
import PropertyCard from '../../components/PropertyCard';
import { Link } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { STATUS_OPTIONS, TYPE_OPTIONS } from '../../utils/options';
import { getAuthData } from '../../api/auth';

const API_URL = import.meta.env.VITE_API_URL;
const fetchProperties = async (params: any) => {
    const res = await axios.get(`${API_URL}/properties`, { params });
    return res.data?.data || { data: [], total: 0 };
};

const ListPage: React.FC = () => {
    const [city, setCity] = useState('');
    const [status, setStatus] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    // check login
    const { data: auth } = useQuery({
        queryKey: ['auth'],
        queryFn: getAuthData,
    });

    const queryKey = ['properties', { city, status, propertyType, minPrice, maxPrice, perPage, page }];

    const {
        data = { data: [], total: 0 },
        isLoading,
        isError,
    } = useQuery({
        queryKey,
        queryFn: () =>
            fetchProperties({
                city,
                status,
                property_type: propertyType,
                min_price: minPrice,
                max_price: maxPrice,
                per_page: perPage,
                page,
            }),
        // 👇 Đưa vào trong object options
        placeholderData: keepPreviousData,
    });

    const properties = data.data || [];
    const total = data.total || 0;
    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold" title="Danh sách bất động sản">
                    不動産一覧
                </h2>
                {auth?.token && (
                    <div className="flex gap-2">
                        <Link to="/create" className="px-4 py-2 bg-green-600 text-white rounded" title="Tạo mới">
                            新規作成
                        </Link>
                    </div>
                )}
            </div>

            {/* Filter UI */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="都市"
                    title="Thành phố"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border px-3 py-2 rounded"
                    title="Trạng thái"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.labelJa}
                        </option>
                    ))}
                </select>
                <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="border px-3 py-2 rounded"
                    title="Loại bất động sản"
                >
                    {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.labelJa} {/* đổi opt.ja thành opt.vi nếu muốn tiếng Việt */}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="最低価格"
                    title="Giá tối thiểu"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border px-3 py-2 rounded w-32"
                />
                <input
                    type="number"
                    placeholder="最高価格"
                    title="Giá tối đa"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border px-3 py-2 rounded w-32"
                />
                <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    title="Số lượng hiển thị trên mỗi trang"
                >
                    {[10, 20, 50, 100].map((num) => (
                        <option key={num} value={num}>
                            {num} 件 / ページ
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setPage(1)}
                    className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
                    title="Lọc dữ liệu"
                >
                    フィルター
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && <div>読み込み中...</div>}
                {isError && <div>物件の読み込み中にエラーが発生しました。</div>}
                {!isLoading && !isError && properties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    title="Trang trước"
                >
                    前へ
                </button>
                <span className="px-3 py-1" title="Số trang hiện tại">
                    {page} / {totalPages || 1}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages || totalPages === 0}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    title="Trang tiếp theo"
                >
                    次へ
                </button>
            </div>
        </div>
    );
};

export default ListPage;
