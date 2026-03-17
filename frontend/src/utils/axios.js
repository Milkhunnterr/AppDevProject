import axios from 'axios';

// 🌐 ตั้งค่า URL ของ Backend
const isDev = import.meta.env.MODE === 'development';

// 🌟 แก้ไขตรงนี้: 
// ถ้าเป็น Dev ให้ใช้ localhost 
// แต่ถ้าไม่ใช่ Dev (เช่นบน Render) ต้องใช้ VITE_API_URL เท่านั้น 
// ถ้าลืมตั้งค่าใน Render ให้มันฟ้อง Error ออกมาเลย ดีกว่าปล่อยให้มันวิ่งไปหา localhost แล้วสมัครไม่ได้
const API_BASE_URL = isDev
    ? 'http://localhost:5000/api'
    : (import.meta.env.VITE_API_URL || 'https://appdevproject-la7w.onrender.com/api'); // ใส่ URL Backend จริงของคุณเป็นค่าสำรองไว้เลย

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// --- ส่วน Interceptor ด้านล่างนี้สมบูรณ์อยู่แล้ว ใช้ตามเดิมได้เลยครับ ---

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/auth/refresh-token')) {
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
                    withCredentials: true,
                });

                processQueue(null);
                isRefreshing = false;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                isRefreshing = false;
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);