import { renderHeader, renderFooter, initMobileMenu } from '../components/layout.js';
import { createPropertyCard } from '../components/ui-cards.js';
import { api } from '../services/api.js';

/**
 * Cấu hình mức giá:
 * Đơn vị: tỷ (đối với Bán) và triệu (đối với Thuê)
 * Lưu ý: Giá trị value phải là định dạng "min-max" để PHP xử lý (price + 0)
 */
const PRICE_RANGE_CONFIG = {
    'Bán': [
        { label: 'Tất cả mức giá', value: '' },
        { label: 'Dưới 1 tỷ', value: '0-1' },
        { label: '1 - 3 tỷ', value: '1-3' },
        { label: '3 - 5 tỷ', value: '3-5' },
        { label: 'Trên 5 tỷ', value: '5-100' }
    ],
    'Thuê': [
        { label: 'Tất cả mức giá', value: '' },
        { label: 'Dưới 5 triệu', value: '0-5' },
        { label: '5 - 10 triệu', value: '5-10' },
        { label: '10 - 20 triệu', value: '10-20' },
        { label: 'Trên 20 triệu', value: '20-100' }
    ]
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Khởi tạo Header/Footer
    const appHeader = document.getElementById('app-header');
    const appFooter = document.getElementById('app-footer');
    if (appHeader) appHeader.innerHTML = renderHeader('home');
    if (appFooter) appFooter.innerHTML = renderFooter();
    initMobileMenu();

    // 2. Lấy các element Search (Dùng ID chuẩn để tránh lỗi Syntax)
    const typeSelect = document.getElementById('hero-type');
    const priceSelect = document.getElementById('hero-price');
    const searchBtn = document.getElementById('hero-search-btn');

    // Kiểm tra nếu tồn tại form search thì mới chạy logic search
    if (typeSelect && priceSelect) {
        
        // Hàm cập nhật dropdown giá
        const updatePriceOptions = (type) => {
            const options = PRICE_RANGE_CONFIG[type] || PRICE_RANGE_CONFIG['Bán'];
            priceSelect.innerHTML = options.map(opt => 
                `<option value="${opt.value}">${opt.label}</option>`
            ).join('');
        };

        // Khởi tạo mức giá mặc định theo loại BĐS đang chọn
        updatePriceOptions(typeSelect.value);

        // Lắng nghe sự kiện thay đổi loại BĐS
        typeSelect.addEventListener('change', (e) => {
            updatePriceOptions(e.target.value);
        });

        // Xử lý sự kiện click nút Tìm kiếm
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const filters = {
                    type: typeSelect.value,
                    price_range: priceSelect.value,
                    location: document.getElementById('hero-location').value.trim() // Lấy giá trị input
                };
                console.log("🔍 Đang tìm kiếm:", filters);
                fetchAndRenderProperties(filters);
                
                // Cuộn xuống phần danh sách kết quả cho mượt
                const listSection = document.getElementById('featured-properties');
                if(listSection) listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    // 3. Tải danh sách BĐS mặc định lần đầu
    fetchAndRenderProperties();
});

/**
 * Hàm lấy dữ liệu từ API và hiển thị lên giao diện
 */
async function fetchAndRenderProperties(filters = {}) {
    const gridContainer = document.getElementById('featured-properties');
    if (!gridContainer) return;

    // Hiển thị trạng thái đang tải
    gridContainer.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p class="mt-4 text-gray-500">Đang tìm kiếm bất động sản...</p>
        </div>
    `;

    try {
        // Gọi API lấy dữ liệu (đã được fix trong api.js để nhận filters)
        const properties = await api.properties.getAll(filters);

        if (properties && properties.length > 0) {
            // Render danh sách card
            gridContainer.innerHTML = properties.map(prop => createPropertyCard(prop)).join('');
            
            // Kích hoạt Lazy Load ảnh
            initLazyLoad();
        } else {
            // Hiển thị khi không có kết quả
            gridContainer.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <i class="ri-search-2-line text-5xl text-gray-300 mb-4 block"></i>
                    <p class="text-gray-500 text-lg">Không tìm thấy bất động sản nào phù hợp.</p>
                    <button onclick="window.location.reload()" class="mt-4 text-blue-600 font-medium hover:underline">
                        Xem tất cả tin đăng
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error("🚨 Lỗi fetch data:", error);
        gridContainer.innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-red-500">Đã có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại sau.</p>
            </div>
        `;
    }
}

/**
 * Hàm xử lý Lazy Load ảnh
 */
function initLazyLoad() {
    const images = document.querySelectorAll('.lazy-image');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => observer.observe(img));
    } else {
        // Fallback cho trình duyệt cũ
        images.forEach(img => { if(img.dataset.src) img.src = img.dataset.src; });
    }
}