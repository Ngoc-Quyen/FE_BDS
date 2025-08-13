import { Link } from 'react-router-dom';
import type { Property } from '../types/property';
import React from 'react';

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    // check login
    return (
        <article className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
                {property.images && property.images.length ? (
                    <img src={property.images[0]} alt={property.title} className="object-cover w-full h-full" />
                ) : (
                    <div className="text-gray-400">No image</div>
                )}
            </div>
            <div className="p-4">
                <h4 className="font-semibold">{property.title}</h4>
                <p className="text-sm text-gray-500">{property.address}</p>

                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <div className="text-lg font-bold">{property.price}</div>
                        <div className="text-xs text-gray-500">
                            {property.beds} beds • {property.baths} baths • {property.area} m²
                        </div>
                    </div>
                    <Link to={`/detail/${property.id}`} className="text-sm text-indigo-600">
                        見る
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default PropertyCard;
