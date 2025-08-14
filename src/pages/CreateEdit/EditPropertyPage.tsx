import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchPropertyDetail, updateProperty } from '../../api/properties';
import { STATUS_OPTIONS, TYPE_OPTIONS } from '../../utils/options';

// Cập nhật schema để bao gồm cả imageUrls
const schema = yup.object({
    title: yup.string().required('Tiêu đề là bắt buộc'),
    description: yup.string().notRequired(),
    property_type: yup.string().required('Loại hình là bắt buộc'),
    status: yup.string().required('Trạng thái là bắt buộc'),
    price: yup.number().typeError('Giá phải là số').positive('Giá phải lớn hơn 0').required('Giá là bắt buộc'),
    area: yup
        .number()
        .typeError('Diện tích phải là số')
        .positive('Diện tích phải lớn hơn 0')
        .required('Diện tích là bắt buộc'),
    bedrooms: yup.number().typeError('Phòng ngủ phải là số').min(0, 'Không thể là số âm'),
    bathrooms: yup.number().typeError('Phòng tắm phải là số').min(0, 'Không thể là số âm'),
    floors: yup.number().typeError('Số tầng phải là số').min(1, 'Phải có ít nhất 1 tầng'),
    address: yup.string().required('Địa chỉ là bắt buộc'),
    city: yup.string().required('Thành phố là bắt buộc'),
    district: yup.string().required('Quận/Huyện là bắt buộc'),
    postal_code: yup.string().notRequired(),
    contact_name: yup.string().notRequired(),
    contact_phone: yup.string().notRequired(),
    contact_email: yup.string().email('Email không hợp lệ').notRequired(),
    // Các trường không bắt buộc khác có thể thêm ở đây
    latitude: yup.number().typeError('Vĩ độ phải là số').notRequired().nullable(),
    longitude: yup.number().typeError('Kinh độ phải là số').notRequired().nullable(),
    year_built: yup.number().typeError('Năm xây dựng phải là số').notRequired().nullable(),
    // Logic ảnh giữ nguyên
    images: yup.mixed().notRequired(),
});

const EditPropertyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State để quản lý các URL ảnh (bao gồm cả link ngoài và link tạm thời của file)
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    // State để quản lý các file ảnh người dùng chọn
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    // State cho ô nhập liệu URL

    const { data: property } = useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyDetail(id!),
        enabled: !!id,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: updateProperty,
        onSuccess: () => navigate(`/detail/${id}`),
    });

    // Effect để điền dữ liệu vào form khi có thông tin bất động sản
    useEffect(() => {
        if (property) {
            const flattenedData = {
                title: property.title,
                description: property.description,
                property_type: property.property_type,
                status: property.status,
                price: property.price,
                area: property.area,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                floors: property.floors,
                address: property.address,
                city: property.city,
                district: property.district,
                postal_code: property.postal_code,
                images: property.images,
                contact_name: property.contact.name,
                contact_phone: property.contact.phone,
            };
            reset(flattenedData);
            if (property.images) {
                setPreviewImages(property.images);
            }
        }
    }, [property, reset]);

    const onSubmit = (data: any) => {
        const formData = new FormData();

        // Thêm các trường dữ liệu text
        Object.keys(data).forEach((key) => {
            if (key !== 'images' && key !== 'imageUrls') {
                formData.append(key, data[key]);
            }
        });

        // Thêm các file ảnh mới
        imageFiles.forEach((file) => {
            formData.append('images[]', file);
        });

        mutation.mutate({ id: id!, data: formData });
    };

    // Xử lý khi người dùng chọn file ảnh
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Cập nhật state chứa các file
            setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);

            // Tạo và hiển thị ảnh xem trước
            const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
            setPreviewImages((prevUrls) => [...prevUrls, ...newPreviewUrls]);
        }
    };

    // Xử lý khi xóa một ảnh (file hoặc URL)
    const handleRemoveImage = (urlToRemove: string) => {
        // Lọc ra khỏi danh sách xem trước
        setPreviewImages((prev) => prev.filter((url) => url !== urlToRemove));

        if (urlToRemove.startsWith('blob:')) {
            // Nếu là file (dạng blob URL), tìm và loại bỏ file tương ứng
            const fileIndex =
                previewImages.findIndex((url) => url === urlToRemove) -
                previewImages.filter((url) => !url.startsWith('blob:')).length;
            setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">不動産を更新する</h2>
            {/* 3. Bổ sung các trường input còn thiếu vào JSX */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Các trường cơ bản */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">タイトル</label>
                    <input {...register('title')} className="border border-gray-300 rounded-lg p-3" />
                    <p className="text-red-500 text-sm">{errors.title?.message}</p>
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">説明</label>
                    <textarea {...register('description')} className="border border-gray-300 rounded-lg p-3 h-24" />
                    <p className="text-red-500 text-sm">{errors.description?.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">物件タイプ</label>
                        <select {...register('property_type')} className="border border-gray-300 rounded-lg p-3">
                            {TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.labelJa}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm">{errors.property_type?.message}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">ステータス</label>
                        <select {...register('status')} className="border border-gray-300 rounded-lg p-3">
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.labelJa}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm">{errors.status?.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">価格</label>
                        <input type="number" {...register('price')} className="border border-gray-300 rounded-lg p-3" />
                        <p className="text-red-500 text-sm">{errors.price?.message}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">面積 (m²)</label>
                        <input type="number" {...register('area')} className="border border-gray-300 rounded-lg p-3" />
                        <p className="text-red-500 text-sm">{errors.area?.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">寝室</label>
                        <input
                            type="number"
                            min="0"
                            {...register('bedrooms')}
                            className="border border-gray-300 rounded-lg p-3"
                        />
                        <p className="text-red-500 text-sm">{errors.bedrooms?.message}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">浴室</label>
                        <input
                            type="number"
                            min="0"
                            {...register('bathrooms')}
                            className="border border-gray-300 rounded-lg p-3"
                        />
                        <p className="text-red-500 text-sm">{errors.bathrooms?.message}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">階数</label>
                        <input
                            type="number"
                            min="1"
                            {...register('floors')}
                            className="border border-gray-300 rounded-lg p-3"
                        />
                        <p className="text-red-500 text-sm">{errors.floors?.message}</p>
                    </div>
                </div>

                {/* Địa chỉ */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <label className="font-medium text-gray-800">詳細住所</label>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-600">住所</label>
                        <input {...register('address')} className="border border-gray-300 rounded-lg p-3" />
                        <p className="text-red-500 text-sm">{errors.address?.message}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            {...register('city')}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="都市"
                        />
                        <input
                            {...register('district')}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="区/郡"
                        />
                        <input
                            {...register('postal_code')}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="Mã bưu chính"
                        />
                    </div>
                    <p className="text-red-500 text-sm">{errors.city?.message || errors.district?.message}</p>
                </div>

                {/* Thông tin liên hệ */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <label className="font-medium text-gray-800">連絡先情報</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            {...register('contact_name')}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="名前"
                        />
                        <input
                            {...register('contact_phone')}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="電話番号"
                        />
                    </div>
                    <p className="text-red-500 text-sm">
                        {errors.contact_name?.message || errors.contact_phone?.message}
                    </p>
                </div>

                {/* Quản lý ảnh */}
                <div className="flex flex-col space-y-4 p-4 border rounded-lg">
                    <label className="font-medium text-gray-800">画像</label>
                    <div>
                        <label className="text-sm font-medium text-gray-600">コンピュータから画像をアップロード</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 p-4 border border-dashed rounded-lg min-h-[100px]">
                        {previewImages.map((url, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={url}
                                    className="w-28 h-28 object-cover rounded-lg shadow-sm border"
                                    alt={`Preview ${idx + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(url)}
                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:bg-gray-400"
                >
                    {mutation.isPending ? '保存中...' : '保存'}
                </button>
            </form>
        </div>
    );
};

export default EditPropertyPage;
