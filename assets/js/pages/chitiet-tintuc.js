import { renderHeader, renderFooter, initMobileMenu } from '../components/layout.js';
import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appHeader = document.getElementById('app-header');
    const appFooter = document.getElementById('app-footer');
    if (appHeader) appHeader.innerHTML = renderHeader('tintuc');
    if (appFooter) appFooter.innerHTML = renderFooter();
    initMobileMenu();

    // Lấy ID từ URL (ưu tiên ?id= hoặc tách từ cuối path)
    const urlParams = new URLSearchParams(window.location.search);
    let postId = urlParams.get('id');

    if (!postId) {
        const paths = window.location.pathname.split('-');
        postId = paths[paths.length - 1]; // Lấy phần cuối sau dấu -
    }

    console.log("Post ID nhận được:", postId);

    if (postId && !isNaN(postId)) {
        await loadPostDetail(postId);
    } else {
        document.getElementById('article-loading').innerHTML = `<div class="text-center py-20 text-red-500">ID bài viết không hợp lệ!</div>`;
    }
});

async function loadPostDetail(id) {
    try {
        const post = await api.news.getById(id);
        if (!post) throw new Error('Không tìm thấy dữ liệu');

        // Render UI
        document.getElementById('breadcrumb-title').textContent = post.title;
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-date').textContent = new Date(post.created_at).toLocaleDateString('vi-VN');
        document.getElementById('post-body').innerHTML = post.content;
        document.getElementById('post-hero').innerHTML = `<img src="${post.image}" class="w-full h-auto rounded-xl">`;
        
        document.getElementById('article-loading').classList.add('hidden');
        document.getElementById('article-content').classList.remove('hidden');

        // Load Related
        loadRelated(id);
    } catch (error) {
        document.getElementById('article-loading').innerHTML = `<div class="text-center py-20">Bài viết đã bị gỡ bỏ.</div>`;
    }
}

async function loadRelated(currentId) {
    try {
        const list = await api.news.getAll();
        const container = document.getElementById('related-news');
        if (container) {
            container.innerHTML = list.filter(i => i.id != currentId).slice(0, 5).map(item => `
                <div class="flex gap-3 group border-b pb-3">
                    <img src="${item.image}" class="w-16 h-12 rounded object-cover">
                    <h4 class="text-sm font-semibold line-clamp-2 hover:text-blue-600">
                        <a href="/chitiet-tintuc/${createSlug(item.title)}-${item.id}">${item.title}</a>
                    </h4>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

function createSlug(str) {
    return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, 'd').replace(/([^0-9a-z\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}