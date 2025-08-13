import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPageApi } from '../../api/properties';
import { STATUS_OPTIONS, TYPE_OPTIONS } from '../../utils/options';

interface PropertyFormValues {
    title: string;
    description: string;
    property_type: 'apartment' | 'house' | 'villa' | 'office' | 'land';
    status: 'available' | 'sold' | 'rented' | 'pending';
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    address: string;
    city: string;
    district: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    year_built?: number;
    features?: string;
    images: File[];
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
}

const initialValues: PropertyFormValues = {
    title: '',
    description: '',
    property_type: 'apartment',
    status: 'available',
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    address: '',
    city: '',
    district: '',
    postal_code: '',
    latitude: undefined,
    longitude: undefined,
    year_built: undefined,
    features: '[]',
    images: [],
    contact_name: '',
    contact_phone: '',
    contact_email: '',
};

const CreatePropertyPage: React.FC = () => {
    const [values, setValues] = useState<PropertyFormValues>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormValues, string>>>({});
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const mutation = useMutation({
        mutationFn: createPageApi,
        onSuccess: () => {
            alert('Property created successfully!');
            setValues(initialValues);
            setImagePreviews([]);
        },
        onError: (error: any) => {
            alert(error?.message || 'Error occurred');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: [
                'price',
                'area',
                'bedrooms',
                'bathrooms',
                'floors',
                'latitude',
                'longitude',
                'year_built',
            ].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArr = Array.from(files);
            setValues((prev) => ({ ...prev, images: fileArr }));
            setImagePreviews(fileArr.map((file) => URL.createObjectURL(file)));
        }
    };

    const validate = () => {
        const errs: Partial<Record<keyof PropertyFormValues, string>> = {};
        if (!values.title) errs.title = 'Title is required';
        if (!values.description) errs.description = 'Description is required';
        if (values.price <= 0) errs.price = 'Price must be greater than 0';
        if (values.area <= 0) errs.area = 'Area must be greater than 0';
        if (!values.address) errs.address = 'Address is required';
        if (!values.city) errs.city = 'City is required';
        if (!values.district) errs.district = 'District is required';
        if (!values.contact_name) errs.contact_name = 'Contact name is required';
        if (!values.contact_phone) errs.contact_phone = 'Contact phone is required';
        if (values.images.length === 0) errs.images = 'At least one image is required';
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'images') {
                    value.forEach((file: File) => formData.append('images', file));
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
            mutation.mutate({ data: formData });
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">不動産を作成する</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700" title="(Tiêu đề)">
                        タイトル{' '}
                    </label>
                    <input
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-3"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700" title="(Mô tả)">
                        説明{' '}
                    </label>
                    <textarea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-3 h-24"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700" title=" (Loại hình)">
                            物件タイプ
                        </label>
                        <select
                            name="property_type"
                            value={values.property_type}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            required
                        >
                            {TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.labelJa}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700" title=" (Trạng thái)">
                            ステータス
                        </label>
                        <select
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.labelJa}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700" title=" (Giá)">
                            価格
                        </label>
                        <input
                            name="price"
                            type="number"
                            value={values.price}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700" title="(Diện tích m²)">
                            面積 (m²)
                        </label>
                        <input
                            name="area"
                            type="number"
                            value={values.area}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700" title="(Phòng ngủ)">
                            寝室{' '}
                        </label>
                        <input
                            name="bedrooms"
                            type="number"
                            min="0"
                            value={values.bedrooms}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700" title="(Phòng tắm)">
                            浴室{' '}
                        </label>
                        <input
                            name="bathrooms"
                            type="number"
                            min="0"
                            value={values.bathrooms}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700" title=" (Số tầng)">
                            階数
                        </label>
                        <input
                            name="floors"
                            type="number"
                            min="1"
                            value={values.floors}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                        />
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                    <label className="font-medium text-gray-800" title="Địa chỉ chi tiết">
                        詳細住所
                    </label>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-600" title="(Địa chỉ)">
                            住所{' '}
                        </label>
                        <input
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="番地・通り名・町名/村名"
                            title="Số nhà, tên đường, phường/xã"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="都市"
                            title="Thành phố"
                            required
                        />
                        <input
                            name="district"
                            value={values.district}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="区/郡"
                            title="Quận/Huyện"
                            required
                        />
                        <input
                            name="postal_code"
                            value={values.postal_code}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="Mã bưu chính"
                        />
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                    <label className="font-medium text-gray-800" title="Thông tin liên hệ">
                        連絡先情報
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="contact_name"
                            value={values.contact_name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="名前"
                            title="Tên người liên hệ"
                            required
                        />
                        <input
                            name="contact_phone"
                            value={values.contact_phone}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3"
                            placeholder="電話番号"
                            title="Số điện thoại"
                            required
                        />
                    </div>
                    <input
                        name="contact_email"
                        type="email"
                        value={values.contact_email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                        placeholder="メール"
                        title="Email liên hệ"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700" title="Hình ảnh">
                        画像{' '}
                    </label>
                    <input
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border p-2 rounded-lg"
                    />
                    <div className="flex flex-wrap gap-3 mt-3">
                        {imagePreviews.map((src, idx) => (
                            <img
                                key={idx}
                                src={src}
                                alt={`preview-${idx}`}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400"
                >
                    {mutation.isPending ? '作成中...' : '作成'}
                </button>
            </form>
        </div>
    );
};

export default CreatePropertyPage;
