/**
 * Helper: Tạo Slug chuẩn SEO từ tiêu đề
 */
function createSlug(str) {
    if (!str) return "";
    return str.toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function createPropertyCard(prop) {
    const badgeColor = prop.type === 'Bán' ? 'bg-blue-600' : 'bg-green-600';
    
    // Thay đổi placeholder từ via.placeholder sang placehold.co (ổn định hơn)
    const defaultImg = 'https://placehold.co/600x400?text=LanAnh+Home';
    
    // Lấy ảnh đầu tiên trong chuỗi ngăn cách bởi dấu phẩy
    let imageUrl = defaultImg;
    if (prop.image && prop.image.trim() !== "") {
        imageUrl = prop.image.split(',')[0].trim();
    }
    
    // TẠO URL CHUẨN SEO: /chitiet/ten-bat-dong-san-id
    const slug = createSlug(prop.title);
    const detailUrl = `/chitiet/${slug}-${prop.id}`;

    return `
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
            
            <!-- Ảnh và Nhãn -->
            <div class="relative h-52 shrink-0 bg-gray-100 overflow-hidden cursor-pointer" onclick="window.location.href='${detailUrl}'">
                <img src="${defaultImg}" 
                     data-src="${imageUrl}" 
                     alt="${prop.title}" 
                     onerror="this.src='${defaultImg}'"
                     class="w-full h-full object-cover lazy-image group-hover:scale-105 transition-transform duration-500">
                     
                <span class="absolute top-3 left-3 px-3 py-1 ${badgeColor} text-white text-xs font-bold rounded shadow-md z-10">
                    ${prop.type || 'BĐS'}
                </span>
            </div>

            <div class="p-5 flex flex-col flex-grow">
                <!-- Title -->
                <h3 class="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 mb-2 transition-colors">
                    <a href="${detailUrl}">${prop.title}</a>
                </h3>
                
                <!-- Giá -->
                <div class="text-xl font-bold text-blue-600 mb-3">
                    ${prop.price}
                </div>
                
                <!-- Thông số -->
                <div class="flex items-center justify-between text-sm text-gray-500 border-t border-b border-gray-50 py-3 mb-4">
                    <div class="flex items-center gap-1.5">
                        <i class="ri-ruler-line text-blue-500"></i>
                        <span>${prop.area ? `${prop.area} m²` : '--'}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <i class="ri-hotel-bed-line text-blue-500"></i>
                        <span>${prop.bed ? `${prop.bed} PN` : '--'}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <i class="ri-showers-line text-blue-500"></i>
                        <span>${prop.wc ? `${prop.wc} WC` : '--'}</span>
                    </div>
                </div>
                
                <!-- Địa chỉ -->
                <div class="flex items-start gap-2 text-sm text-gray-600 mb-4 flex-grow">
                    <i class="ri-map-pin-line text-gray-400 mt-0.5"></i>
                    <span class="line-clamp-2">${prop.location || 'Đang cập nhật địa chỉ'}</span>
                </div>
                
                <!-- Nút bấm -->
                <a href="${detailUrl}" class="block text-center w-full py-2.5 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 text-sm font-bold rounded-lg transition-all border border-blue-100 group-hover:border-blue-600">
                    XEM CHI TIẾT
                </a>
            </div>
        </div>
    `;
}