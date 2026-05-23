/**
 * File: assets/services/api.js
 * Chứa các API call cho toàn bộ hệ thống
 */

const API_BASE_URL = '/api/v1';

async function request(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // Bắt lỗi HTTP trước khi parse JSON
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Kiểm tra cấu trúc response của API (hỗ trợ cả hai kiểu status)
        if (result.status === 'success' || result.success === true) {
            return result.data !== undefined ? result.data : (result.urls || result);
        }
        
        throw new Error(result.message || 'Unknown error');
    } catch (error) {
        console.error(`🚨 API Request Error [${endpoint}]:`, error);
        throw error;
    }
}

export const api = {
    // Logic cho Properties (Giữ nguyên cấu trúc của bạn)
    properties: {
        getAll: (filters = {}) => {
            const query = new URLSearchParams(filters).toString();
            return request(`/properties.php${query ? '?' + query : ''}`);
        },
        getById: (id) => request(`/properties.php?id=${id}`),
        create: (data) => request('/properties.php', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/properties.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/properties.php?id=${id}`, { method: 'DELETE' })
    },
    
    // Logic cho News (Bổ sung để làm việc với news.php)
    news: {
        getAll: () => request('/news.php'),
        getById: (id) => request(`/news.php?id=${id}`),
        create: (data) => request('/news.php', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/news.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/news.php?id=${id}`, { method: 'DELETE' })
    }
};