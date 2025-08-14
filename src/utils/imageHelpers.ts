interface Image {
    id: number;
    image_path: string;
    is_primary: boolean;
    sort_order: number;
}
const BASE_IMG_URL = import.meta.env.VITE_IMG_URL;

export const getPrimaryImageUrl = (images: Image[] | undefined): string | null => {
    if (!images || images.length === 0) {
        return null;
    }

    // Ưu tiên ảnh có `is_primary: true`, nếu không có thì lấy ảnh đầu tiên
    const imageToShow = images.find((img) => img.is_primary) || images[0];

    return `${BASE_IMG_URL}${imageToShow.image_path}`;
};
