import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuthData } from '../../api/auth';
import DeleteButton from '../../components/DeleteButton';
import { STATUS_OPTIONS, TYPE_OPTIONS } from '../../utils/options'; // Import options để lấy nhãn
import { fetchPropertyDetail } from '../../api/properties';
import { getPrimaryImageUrl } from '../../utils/imageHelpers';

interface ContactInfo {
    name: string;
    phone: string;
    email: string | null; // email có thể là null
}

// Định nghĩa một interface cho đối tượng lồng nhau `location`
interface LocationInfo {
    latitude: number;
    longitude: number;
}
// Định nghĩa kiểu dữ liệu cho property để có type-safety
interface Property {
    id: number;
    title: string;
    description: string;
    property_type: string;
    status: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    address: string;
    city: string;
    district: string;
    postal_code?: string;
    year_built?: number;
    // Sử dụng các interface lồng nhau đã định nghĩa ở trên
    contact: ContactInfo;
    location: LocationInfo;
    images: [];
}

// Hàm trợ giúp để lấy nhãn tiếng Nhật từ value
const findLabel = (options: { value: string; labelJa: string }[], value: string) => {
    return options.find((opt) => opt.value === value)?.labelJa || value;
};

const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State cho ảnh chính đang được chọn
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: auth } = useQuery({ queryKey: ['auth'], queryFn: getAuthData });

    const {
        data: property,
        isLoading,
        isError,
    } = useQuery<Property | null>({
        queryKey: ['property', id],
        queryFn: () => {
            if (!id) {
                return Promise.resolve(null);
            }
            return fetchPropertyDetail(id);
        },
        enabled: !!id,
    });

    // Cập nhật ảnh chính khi dữ liệu property thay đổi
    useEffect(() => {
        if (property?.images && property.images.length > 0) {
            const imageUrl = getPrimaryImageUrl(property?.images);
            setSelectedImage(imageUrl);
        }
    }, [property]);

    if (isLoading) return <div className="max-w-5xl mx-auto p-8 mt-8 text-center">読み込み中...</div>;
    if (isError || !property)
        return (
            <div className="max-w-5xl mx-auto p-8 mt-8 text-center text-red-600">
                物件の読み込み中にエラーが発生しました。
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-lg mt-8 mb-8">
            {/* Phần Header: Tiêu đề, Giá và Trạng thái */}
            <header className="pb-4 border-b">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
                    <span className="text-3xl font-extrabold text-blue-600 whitespace-nowrap">
                        {property.price?.toLocaleString()} 円
                    </span>
                </div>
                <div className="mt-2">
                    <span
                        className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${
                            property.status === 'available' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                    >
                        {findLabel(STATUS_OPTIONS, property.status)}
                    </span>
                </div>
            </header>

            {/* Thư viện ảnh */}
            {property.images && property.images.length > 0 && (
                <div className="my-6">
                    <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                            src={selectedImage || ''}
                            alt="Main property view"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {property.images.map((img, idx) => (
                            <button key={idx} onClick={() => setSelectedImage(img)}>
                                <img
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
                                        selectedImage === img ? 'border-blue-500' : 'border-transparent'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Thông tin chi tiết */}
            <div className="space-y-6">
                {/* Chi tiết chính */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">基本情報</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">物件タイプ</span>
                            <span className="font-medium">{findLabel(TYPE_OPTIONS, property.property_type)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">面積</span>
                            <span className="font-medium">{property.area} m²</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">寝室</span>
                            <span className="font-medium">{property.bedrooms} 室</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">浴室</span>
                            <span className="font-medium">{property.bathrooms} 室</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">階数</span>
                            <span className="font-medium">{property.floors} 階</span>
                        </div>
                        {property.year_built && (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">築年数</span>
                                <span className="font-medium">{property.year_built} 年</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mô tả */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">説明</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
                </div>

                {/* Vị trí */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">所在地</h3>
                    <p className="text-gray-600">{`${property.city}, ${property.district}, ${property.address}`}</p>
                    {property.postal_code && <p className="text-gray-600">郵便番号: {property.postal_code}</p>}
                </div>

                {/* Thông tin liên hệ */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">連絡先情報</h3>
                    <p className="text-gray-600">
                        <strong>担当者:</strong> {property.contact.name}
                    </p>
                    <p className="text-gray-600">
                        <strong>電話番号:</strong> {property.contact.phone}
                    </p>
                    {property.contact.email && (
                        <p className="text-gray-600">
                            <strong>メール:</strong> {property.contact.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Nút hành động cho admin */}
            {auth?.token && (
                <div className="flex items-center gap-4 mt-8 pt-6 border-t">
                    <Link
                        to={`/edit/${property.id}`}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                        編集
                    </Link>
                    <DeleteButton
                        propertyId={property.id}
                        onDeleted={() => {
                            // Sau khi xóa, vô hiệu hóa query cũ và chuyển hướng về trang danh sách
                            alert('物件を削除しました。');
                            queryClient.invalidateQueries({ queryKey: ['properties'] }); // Giả sử query list là 'properties'
                            navigate('/list'); // Điều hướng về trang danh sách
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DetailPage;
