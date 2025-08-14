import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { deletePropertyApi } from '../api/properties';
import { useNavigate } from 'react-router-dom';

interface DeleteButtonProps {
    propertyId: number;
    onDeleted?: () => void; // callback sau khi xóa thành công
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ propertyId, onDeleted }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: () => deletePropertyApi(propertyId),
        onSuccess: () => {
            alert('削除しました');
            setIsOpen(false);
            navigate('/list');
            if (onDeleted) onDeleted();
        },
        onError: (error: any) => {
            alert(error?.message || 'エラーが発生しました'); // Lỗi xảy ra
        },
    });

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 hover:shadow-md transition-all duration-200 ease-in-out"
                title="Xóa"
            >
                削除
            </button>

            {/* Modal xác nhận */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4">本当に削除しますか？</h3>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={() => mutation.mutate()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteButton;
