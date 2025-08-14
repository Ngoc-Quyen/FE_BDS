import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getAuthData } from '../../api/auth';
import DeleteButton from '../../components/DeleteButton';

const API_URL = import.meta.env.VITE_API_URL;

const fetchPropertyDetail = async (id: string | undefined) => {
    if (!id) return null;
    const res = await axios.get(`${API_URL}/properties/${id}`);
    return res.data?.data || null;
};

const DetailPage: React.FC = () => {
    const { data: auth } = useQuery({
        queryKey: ['auth'],
        queryFn: getAuthData,
    });
    const { id } = useParams<{ id: string }>();
    const {
        data: property,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyDetail(id),
        enabled: !!id,
    });
    if (isLoading) return <div className="max-w-4xl mx-auto p-6 mt-8">読み込み中...</div>;
    if (isError || !property)
        return <div className="max-w-4xl mx-auto p-6 mt-8">物件の読み込み中にエラーが発生しました。</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow mt-8">
            <h2 className="text-2xl font-semibold">{property.title}</h2>
            <p className="text-gray-600 mt-2">物価: {property.price?.toLocaleString()} VND</p>
            <p className="text-gray-600">都市: {property.city}</p>
            <p className="text-gray-600">状態: {property.status}</p>
            {/* Gallery ảnh */}
            {property.images && property.images.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium mb-2">画像ギャラリー</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {property.images.map((img: string, idx: number) => (
                            <div
                                key={idx}
                                className="overflow-hidden rounded shadow hover:scale-105 transition-transform duration-200"
                            >
                                <img src={img} alt={`Ảnh ${idx + 1}`} className="w-full h-56 object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {auth?.token && (
                <div className="flex gap-2 mt-6">
                    <Link
                        to={`/edit/${property.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out"
                        title="Cập nhật"
                    >
                        編集
                    </Link>
                    <DeleteButton
                        propertyId={property.id}
                        onDeleted={() => {
                            // Tuỳ chọn: update UI sau khi xóa, ví dụ refetch danh sách
                            alert('削除しました');
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DetailPage;
