import { renderHeader, renderFooter, initMobileMenu } from '../components/layout.js';
import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Layout
    const appHeader = document.getElementById('app-header');
    const appFooter = document.getElementById('app-footer');
    if (appHeader) appHeader.innerHTML = renderHeader();
    if (appFooter) appFooter.innerHTML = renderFooter();
    initMobileMenu();

    // 2. LẤY ID TỪ URL (Hỗ trợ cả link SEO và link cũ)
    let propId = null;
    const urlParams = new URLSearchParams(window.location.search);
    propId = urlParams.get('id'); // Thử lấy từ ?id=

    if (!propId) {
        // Nếu không có ?id=, thử bóc tách từ URL SEO (số cuối cùng sau dấu gạch ngang)
        const pathParts = window.location.pathname.split('-');
        const lastPart = pathParts[pathParts.length - 1].replace('.html', '');
        if (!isNaN(lastPart)) {
            propId = lastPart;
        }
    }

    // 3. KIỂM TRA ID HỢP LỆ TRƯỚC KHI GỌI API (Fix lỗi Uncaught in promise)
    if (!propId) {
        console.error("Không tìm thấy ID bất động sản hợp lệ trong URL.");
        renderErrorPage();
        return;
    }

    await loadPropertyDetail(propId);
});

async function loadPropertyDetail(id) {
    try {
        const prop = await api.properties.getById(id);

        if (!prop) throw new Error("Dữ liệu trống");

        // Cập nhật SEO & Breadcrumb
        updatePropertySEO(prop);
        updateBreadcrumb(prop);

        // Thông tin chính
        document.getElementById('detail-title').textContent = prop.title;
        document.getElementById('detail-location').textContent = prop.location || 'Đang cập nhật địa chỉ';

        const priceSuffix = prop.type === 'Thuê' ? ' <span class="text-lg text-gray-500 font-normal ml-1"></span>' : '';
        document.getElementById('detail-price').innerHTML = `${prop.price}${priceSuffix}`;

        // Thông số kỹ thuật
        const formatValue = (val, unit) => val ? (String(val).toLowerCase().includes(unit.toLowerCase()) ? val : `${val} ${unit}`) : '--';
        document.getElementById('detail-area').textContent = formatValue(prop.area, 'm²');
        document.getElementById('detail-bed').textContent = formatValue(prop.bed, 'PN');
        document.getElementById('detail-wc').textContent = formatValue(prop.wc, 'WC');

        // Gallery & Mô tả
        renderGallery(prop);
        
        const descElement = document.getElementById('detail-description');
        if (descElement) {
            descElement.innerHTML = (prop.description && prop.description !== "null") 
                ? prop.description 
                : `<p class="italic text-gray-500">Thông tin mô tả đang được cập nhật.</p>`;
        }

        // Badge loại BĐS
        const typeBadge = document.getElementById('detail-type');
        if (typeBadge) {
            typeBadge.textContent = prop.type;
            typeBadge.className = `absolute top-4 left-4 px-3 py-1 text-white text-sm font-bold rounded shadow-sm ${prop.type === 'Bán' ? 'bg-blue-600' : 'bg-green-600'}`;
        }

        // Ẩn loading, hiện content
        document.getElementById('article-loading')?.classList.add('hidden');
        document.getElementById('article-content')?.classList.remove('hidden');

    } catch (error) {
        console.error("Lỗi khi tải chi tiết BĐS:", error);
        renderErrorPage();
    }
}

function renderGallery(prop) {
    const mainImg = document.getElementById('detail-image');
    const galleryContainer = document.getElementById('gallery-thumbnails');
    if (!mainImg || !galleryContainer) return;

    const defaultImg = 'https://placehold.co/800x600?text=LanAnh+Home';
    let images = prop.image ? prop.image.split(',').map(url => url.trim()).filter(url => url !== "") : [];
    
    if (images.length === 0) images = [defaultImg];

    mainImg.src = images[0];
    galleryContainer.innerHTML = images.slice(0, 5).map((imgUrl, index) => {
        const isFirst = index === 0;
        let overlay = (index === 4 && images.length > 5) ? `<div class="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold">+${images.length - 5}</div>` : '';
        
        return `
            <div class="aspect-square rounded border-2 ${isFirst ? 'border-blue-600' : 'border-transparent opacity-70'} overflow-hidden cursor-pointer thumb-item relative" data-src="${imgUrl}">
                <img src="${imgUrl.replace('/upload/', '/upload/w_200,c_fill/')}" class="w-full h-full object-cover" onerror="this.src='${defaultImg}'">
                ${overlay}
            </div>
        `;
    }).join('');

    // Khởi tạo sự kiện gallery
    const thumbs = document.querySelectorAll('.thumb-item');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const newSrc = this.getAttribute('data-src');
            mainImg.style.opacity = '0.4';
            setTimeout(() => {
                mainImg.src = newSrc;
                mainImg.style.opacity = '1';
            }, 100);
            thumbs.forEach(t => {
                t.classList.replace('border-blue-600', 'border-transparent');
                t.classList.add('opacity-70');
            });
            this.classList.replace('border-transparent', 'border-blue-600');
            this.classList.remove('opacity-70');
        });
    });
}

function updatePropertySEO(prop) {
    document.title = `${prop.title} | LanAnh Home`;
    const description = `${prop.title} tại ${prop.location}. Giá: ${prop.price}. Diện tích: ${prop.area}. Liên hệ LanAnh Home ngay.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
}

function updateBreadcrumb(prop) {
    const typeText = document.getElementById('breadcrumb-type-text');
    const typeLink = document.getElementById('breadcrumb-type-link');
    const titleActive = document.getElementById('breadcrumb-title-active');

    if (typeText && typeLink) {
        typeText.textContent = prop.type === 'Bán' ? 'Mua bán' : 'Cho thuê';
        typeLink.href = prop.type === 'Bán' ? '/mua' : '/thue';
    }
    if (titleActive) titleActive.textContent = prop.title;
}

function renderErrorPage() {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="text-center py-32 px-4">
                <i class="ri-error-warning-line text-6xl text-gray-300"></i>
                <h2 class="text-2xl font-bold mt-4">Bất động sản không tồn tại</h2>
                <p class="text-gray-500 mt-2">Dữ liệu đã bị xóa hoặc đường dẫn không chính xác.</p>
                <a href="/index.html" class="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Về trang chủ</a>
            </div>
        `;
    }
}