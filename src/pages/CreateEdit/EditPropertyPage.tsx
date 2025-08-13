import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchPropertyDetail, updateProperty } from '../../api/properties';

// Cập nhật schema để bao gồm cả imageUrls
const schema = yup.object({
    title: yup.string().required('Tiêu đề bắt buộc'),
    price: yup.number().typeError('Giá phải là một con số').required('Giá bắt buộc').positive('Giá phải là số dương'),
    city: yup.string().required('Thành phố bắt buộc'),
    status: yup.string().required('Trạng thái bắt buộc'),
    // Giữ images cho file uploads, không bắt buộc
    images: yup.mixed().notRequired(),
    // Thêm imageUrls để xác thực mảng các chuỗi URL
    imageUrls: yup.array().of(yup.string().url('Định dạng URL không hợp lệ')).notRequired(),
});

const EditPropertyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State để quản lý các URL ảnh (bao gồm cả link ngoài và link tạm thời của file)
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    // State để quản lý các file ảnh người dùng chọn
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    // State cho ô nhập liệu URL
    const [imageUrlInput, setImageUrlInput] = useState('');

    const { data: property } = useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyDetail(id!),
        enabled: !!id,
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
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
            reset({
                title: property.title,
                price: property.price,
                city: property.city,
                status: property.status,
            });
            // Hiển thị các ảnh đã có từ server
            setPreviewImages(property.images || []);
            // Đồng bộ imageUrls vào react-hook-form
            setValue('imageUrls', property.images || []);
        }
    }, [property, reset, setValue]);

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

        // Thêm các URL ảnh
        const existingUrls = previewImages.filter((url) => !url.startsWith('blob:'));
        existingUrls.forEach((url) => {
            formData.append('imageUrls[]', url);
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

    // Xử lý khi người dùng thêm một URL ảnh
    const handleAddImageUrl = () => {
        if (imageUrlInput && !previewImages.includes(imageUrlInput)) {
            const updatedUrls = [...previewImages, imageUrlInput];
            setPreviewImages(updatedUrls);
            setValue(
                'imageUrls',
                updatedUrls.filter((url) => !url.startsWith('blob:'))
            );
            setImageUrlInput('');
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
        } else {
            // Nếu là URL, cập nhật lại giá trị cho form
            setValue(
                'imageUrls',
                previewImages.filter((url) => url !== urlToRemove && !url.startsWith('blob:'))
            );
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-800" title="Cập nhật bất động sản">
                不動産を更新する
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Các trường input title, price, city, status không đổi */}
                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700" title="Tiêu đề">
                        タイトル
                    </label>
                    <input
                        {...register('title')}
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="タイトルを入力してください"
                    />
                    <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700" title="Giá">
                        価格
                    </label>
                    <input
                        type="number"
                        {...register('price')}
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="価格を入力してください"
                    />
                    <p className="text-red-500 text-sm mt-1">{errors.price?.message}</p>
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700" title="Thành phố">
                        都市
                    </label>
                    <input
                        {...register('city')}
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="都市名を入力してください"
                    />
                    <p className="text-red-500 text-sm mt-1">{errors.city?.message}</p>
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700" title="Trạng thái">
                        ステータス
                    </label>
                    <select
                        {...register('status')}
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="available">空き</option>
                        <option value="sold">売却済み</option>
                    </select>
                    <p className="text-red-500 text-sm mt-1">{errors.status?.message}</p>
                </div>

                {/* Phần upload ảnh và URL */}
                <div className="flex flex-col space-y-4">
                    <label className="mb-2 font-medium text-gray-700" title="Ảnh">
                        画像
                    </label>

                    {/* Upload từ file */}
                    <div>
                        <label className="text-sm font-medium text-gray-600" title="Tải ảnh từ máy tính">
                            コンピュータから画像をアップロード
                        </label>
                        <input
                            type="file"
                            {...register('images')}
                            multiple
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* Thêm từ URL */}
                    <div>
                        <label className="text-sm font-medium text-gray-600" title="Thêm ảnh từ URL">
                            URLから画像を追加
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="https://example.com/image.png"
                            />
                            <button
                                type="button"
                                onClick={handleAddImageUrl}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg"
                                title="Thêm URL"
                            >
                                URLを追加
                            </button>
                        </div>
                    </div>

                    {/* Khu vực xem trước ảnh */}
                    <div className="flex flex-wrap gap-4 mt-4 p-4 border border-dashed rounded-lg min-h-[100px]">
                        {previewImages.length > 0 ? (
                            previewImages.map((url, idx) => (
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
                                        title="Xóa ảnh"
                                    >
                                        X
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400" title="Chưa có ảnh nào">
                                まだ画像はありません
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:bg-gray-400"
                    title="Cập nhật"
                >
                    {mutation.isPending ? '保存中...' : '保存'}
                </button>
            </form>
        </div>
    );
};

export default EditPropertyPage;
