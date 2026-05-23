/**
 * File: assets/js/components/layout.js
 * Hợp nhất: Cấu trúc chi tiết (Layout 1) + Cơ chế Render Portal (Layout 2)
 */

export function renderHeader(activePage = 'home') {
    const navItems =[
        { id: 'home', name: 'Trang chủ', link: '/' },
        { id: 'mua', name: 'Mua bán', link: '/mua' },
        { id: 'thue', name: 'Cho thuê', link: '/thue' },
        { id: 'tintuc', name: 'Tin tức', link: '/tintuc' },
        { id: 'lienhe', name: 'Liên hệ', link: '/lienhe' }
    ];

    const getNavHtml = (isMobile = false) => navItems.map(item => {
        const isActive = item.id === activePage;
        const baseClass = isMobile ? 'block py-3 px-4 rounded-lg' : 'relative py-2';
        const activeClass = isActive 
            ? (isMobile ? 'bg-blue-50 text-blue-600 font-bold' : 'text-blue-600 font-bold') 
            : 'text-gray-700 hover:text-blue-600';
        return `<a href="${item.link}" class="${baseClass} ${activeClass}">${item.name}</a>`;
    }).join('');

    return `
    <header class="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center">
                    <a href="/" class="font-['Pacifico'] text-2xl text-blue-600 font-bold">LanAnh Home</a>
                </div>
                <nav class="hidden md:flex items-center space-x-10 text-[15px]">${getNavHtml()}</nav>
                <div class="hidden lg:flex items-center gap-6">
                    <input type="text" placeholder="Tìm kiếm dự án..." class="w-64 pl-4 pr-4 py-2 border rounded-full text-sm">
                    <button class="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm">Đăng nhập</button>
                </div>
                <button class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600" id="mobile-menu-btn">
                    <i class="ri-menu-3-line text-2xl"></i>
                </button>
            </div>
        </div>
    </header>
    <div id="mobile-menu-container"></div>
    `;
}

export function initMobileMenu() {
    const container = document.getElementById('mobile-menu-container');
    const btn = document.getElementById('mobile-menu-btn');
    if (!container || !btn) return;

    container.innerHTML = `
        <div id="menu-overlay" class="fixed inset-0 bg-black/50 z-[9998] opacity-0 pointer-events-none transition-opacity duration-300"></div>
        <div id="mobile-menu" class="fixed inset-y-0 right-0 z-[9999] w-[280px] bg-white shadow-2xl translate-x-full transition-transform duration-300 ease-in-out flex flex-col">
            <div class="p-6 flex justify-between items-center border-b">
                <span class="font-['Pacifico'] text-xl text-blue-600">LanAnh Home</span>
                <button id="close-menu-btn" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <i class="ri-close-line text-xl"></i>
                </button>
            </div>
            <div class="flex-1 p-6">
                <nav class="flex flex-col gap-2">
                    <a href="/" class="block py-3 px-4">Trang chủ</a>
                    <a href="/mua" class="block py-3 px-4">Mua bán</a>
                    <a href="/thue" class="block py-3 px-4">Cho thuê</a>
                    <a href="/tintuc" class="block py-3 px-4">Tin tức</a>
                    <a href="/lienhe" class="block py-3 px-4">Liên hệ</a>
                </nav>
            </div>
        </div>
    `;

    const overlay = document.getElementById('menu-overlay');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-menu-btn');

    const toggle = (open) => {
        menu.classList.toggle('translate-x-full', !open);
        overlay.classList.toggle('opacity-0', !open);
        overlay.classList.toggle('pointer-events-none', !open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    btn.addEventListener('click', () => toggle(true));
    closeBtn.addEventListener('click', () => toggle(false));
    overlay.addEventListener('click', () => toggle(false));
}

export function renderFooter() {
    return `
    <footer class="bg-gray-900 text-white py-12 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <div class="font-['Pacifico'] text-2xl text-blue-500 font-bold mb-4">LanAnhHome</div>
                    <p class="text-gray-300 mb-4 text-sm">Nền tảng bất động sản hàng đầu, kết nối người mua và người bán hiệu quả.</p>
                    <div class="flex space-x-4">
                        ${['facebook','twitter','instagram','linkedin'].map(s => `<div class="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-blue-600 cursor-pointer"><i class="ri-${s}-fill"></i></div>`).join('')}
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Liên kết nhanh</h4>
                    <ul class="space-y-2 text-sm text-gray-300">
                        <li><a href="/" class="hover:text-white">Trang chủ</a></li>
                        <li><a href="/mua" class="hover:text-white">Mua bán BDS</a></li>
                        <li><a href="/thue" class="hover:text-white">Cho thuê BDS</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Dịch vụ</h4>
                    <ul class="space-y-2 text-sm text-gray-300">
                        <li><a href="#" class="hover:text-white">Định giá BDS</a></li>
                        <li><a href="#" class="hover:text-white">Tư vấn pháp lý</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Liên hệ</h4>
                    <div class="space-y-3 text-sm text-gray-300">
                        <p><i class="ri-phone-line mr-2 text-blue-500"></i>1900 1234</p>
                        <p><i class="ri-mail-line mr-2 text-blue-500"></i>info@LAHome.com</p>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                © 2024 LanAnhHome. Tất cả quyền được bảo lưu.
            </div>
        </div>
    </footer>`;
}