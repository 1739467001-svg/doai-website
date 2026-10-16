/**
 * API 基础路径：子路径部署（/doai/）时 fetch 需带前缀，
 * 由 Vite BASE_URL 决定；Nginx 将 <base>/api/* 转发到后端。
 */
export const apiBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const apiUrl = (path: string) => apiBase + path;
