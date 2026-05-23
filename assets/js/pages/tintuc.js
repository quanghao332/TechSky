import { renderHeader, renderFooter, initMobileMenu } from '../components/layout.js';
import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appHeader = document.getElementById('app-header');
    const appFooter = document.getElementById('app-footer');
    if (appHeader) appHeader.innerHTML = renderHeader('tintuc');
    if (appFooter) appFooter.innerHTML = renderFooter();
    initMobileMenu();
    await renderNewsList();
});

function createSlug(str) {
    return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, 'd').replace(/([^0-9a-z\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

async function renderNewsList() {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    try {
        const news = await api.news.getAll();
        grid.innerHTML = news.map(item => {
            const slug = createSlug(item.title);
            const detailLink = `/chitiet-tintuc/${slug}-${item.id}`;
            const img = item.image ? item.image.replace('/upload/', '/upload/w_600,c_fill,g_auto,q_auto,f_auto/') : '/assets/images/default.jpg';
            const date = new Date(item.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

            return `
                <article class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <a href="${detailLink}" class="block overflow-hidden relative">
                        <img src="${img}" alt="${item.title}" class="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-blue-600 shadow-sm">Tin tức</div>
                    </a>
                    <div class="p-6">
                        <div class="text-xs text-gray-400 mb-2 font-medium flex items-center">
                            <i class="ri-calendar-line mr-1"></i> ${date}
                        </div>
                        <h3 class="font-bold text-lg text-gray-900 mb-3 leading-snug line-clamp-2">
                            <a href="${detailLink}" class="hover:text-blue-600 transition-colors">${item.title}</a>
                        </h3>
                        <p class="text-gray-500 text-sm mb-4 line-clamp-3">${item.content.replace(/<[^>]+>/g, '').substring(0, 120)}...</p>
                        <a href="${detailLink}" class="inline-flex items-center text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                            Đọc tiếp <i class="ri-arrow-right-line ml-1"></i>
                        </a>
                    </div>
                </article>
            `;
        }).join('');
    } catch (e) {
        grid.innerHTML = `<p class="text-center text-gray-500 py-10">Hiện chưa có tin tức mới.</p>`;
    }
}