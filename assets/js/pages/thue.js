import { renderHeader, renderFooter, initMobileMenu } from '../components/layout.js';
import { createPropertyCard } from '../components/ui-cards.js';
import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appHeader = document.getElementById('app-header');
    const appFooter = document.getElementById('app-footer');

    if (appHeader) appHeader.innerHTML = renderHeader('thue');
    if (appFooter) appFooter.innerHTML = renderFooter();
    initMobileMenu();

    initViewToggle();
    await loadProperties();
});

// Helper: Tạo Slug tương tự mua.js
function createSlug(str) {
    if (!str) return "";
    return str.toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, 'd').replace(/([^0-9a-z\s])/g, '')
        .replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

async function loadProperties() {
    const gridContainer = document.getElementById('property-grid');
    if (!gridContainer) return;

    try {
        const allProperties = await api.properties.getAll();
        const propertiesForRent = allProperties.filter(prop => prop.type === "Thuê");

        const htmlContent = propertiesForRent.map(prop => {
            const processedProp = { ...prop };
            
            // Lọc ảnh đầu tiên
            let firstImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'; 
            if (prop.image) {
                const images = prop.image.split(',').map(url => url.trim()).filter(url => url !== "");
                if (images.length > 0) firstImage = images[0];
            }
            processedProp.image = firstImage;

            // Xây dựng SEO URL cho trang thuê
            const slug = createSlug(prop.title);
            processedProp.detailUrl = `/chitiet/${slug}-${prop.id}`;

            return createPropertyCard(processedProp);
        }).join('');

        gridContainer.innerHTML = htmlContent || '<p class="col-span-full text-center py-20 text-gray-500">Chưa có bất động sản nào cho thuê.</p>';
        
        initLazyLoad();
        updateResultCount(propertiesForRent.length);

    } catch (error) {
        console.error("Lỗi khi tải danh sách cho thuê:", error);
        gridContainer.innerHTML = '<p class="text-red-500 col-span-full text-center py-20">Lỗi không tải được dữ liệu.</p>';
    }
}

function updateResultCount(count) {
    const countText = document.querySelector('h2.text-2xl.font-bold + p');
    if (countText) countText.textContent = `Tìm thấy ${count} bất động sản cho thuê phù hợp`;
}

function initLazyLoad() {
    const images = document.querySelectorAll('.lazy-image');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if(img.dataset.src) img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => observer.observe(img));
    }
}

function initViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const propertyGrid = document.getElementById('property-grid');
    if (!gridViewBtn || !listViewBtn || !propertyGrid) return;

    gridViewBtn.addEventListener('click', () => {
        propertyGrid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8';
        gridViewBtn.classList.add('bg-green-500', 'text-white');
        listViewBtn.classList.remove('bg-green-500', 'text-white');
    });

    listViewBtn.addEventListener('click', () => {
        propertyGrid.className = 'flex flex-col space-y-4 mb-8';
        listViewBtn.classList.add('bg-green-500', 'text-white');
        gridViewBtn.classList.remove('bg-green-500', 'text-white');
    });
}