type Property = {
    id: string;
    title: string;
    address: string;
    price: string;
    beds?: number;
    baths?: number;
    area?: number; // m2
    images?: string[];
};

export type { Property };

const sampleProperties: Property[] = [
    {
        id: '1',
        title: 'Căn hộ ven sông',
        address: 'Quận 2, TP.HCM',
        price: '3.2 tỷ',
        beds: 2,
        baths: 2,
        area: 75,
        images: [],
    },
    {
        id: '2',
        title: 'Biệt thự sân vườn',
        address: 'Đà Nẵng',
        price: '12 tỷ',
        beds: 4,
        baths: 3,
        area: 320,
        images: [],
    },
    {
        id: '3',
        title: 'Nhà phố trung tâm',
        address: 'Hà Nội',
        price: '6.5 tỷ',
        beds: 3,
        baths: 3,
        area: 120,
        images: [],
    },
];

export { sampleProperties };
