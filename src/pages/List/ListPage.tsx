import React from 'react';
import { sampleProperties } from '../../types/property';
import PropertyCard from '../../components/PropertyCard';
import { Link } from 'react-router-dom';

const ListPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Danh sách bất động sản</h2>
                <Link to="/create" className="px-4 py-2 bg-green-600 text-white rounded">
                    Tạo mới
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProperties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                ))}
            </div>
        </div>
    );
};

export default ListPage;
