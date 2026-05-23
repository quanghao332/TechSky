import { api } from "./services/api.js";

// ================= GLOBAL INIT =================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 App started");

    // test API (debug xem có chạy không)
    try {
        const res = await api.getProperties();
        console.log("📦 Properties:", res);
    } catch (err) {
        console.error("❌ API fail:", err);
    }

    initMobileMenu();
});


// ================= MOBILE MENU =================
function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    const close = document.getElementById("close-menu-btn");

    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
        menu.classList.add("active");
    });

    close?.addEventListener("click", () => {
        menu.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove("active");
        }
    });
}