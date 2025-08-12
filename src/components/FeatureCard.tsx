import React from 'react';

const Feature: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
    <div className="p-4 bg-white rounded-md shadow-sm">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
    </div>
);

export default Feature;
