import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://portpofilio-backend-mern.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (typeof window !== "undefined") window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: FormData) => api.put("/auth/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.put("/auth/change-password", data),
};

export const projectAPI = {
  getAll: (params?: Record<string, string>) => api.get("/projects", { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post("/projects", data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const skillAPI = {
  getAll: () => api.get("/skills"),
  create: (data: any) => api.post("/skills", data),
  update: (id: string, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

export const experienceAPI = {
  getAll: (params?: Record<string, string>) => api.get("/experiences", { params }),
  create: (data: any) => api.post("/experiences", data),
  update: (id: string, data: any) => api.put(`/experiences/${id}`, data),
  delete: (id: string) => api.delete(`/experiences/${id}`),
};

export const testimonialAPI = {
  getAll: () => api.get("/testimonials"),
  getAllAdmin: () => api.get("/testimonials/all"),
  create: (data: any) => api.post("/testimonials", data),
  update: (id: string, data: any) => api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};

export const serviceAPI = {
  getAll: () => api.get("/services"),
  create: (data: any) => api.post("/services", data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

export const contactAPI = {
  send: (data: { name: string; email: string; subject: string; message: string }) => api.post("/contact", data),
  getAll: (params?: Record<string, string>) => api.get("/contact", { params }),
  markRead: (id: string) => api.put(`/contact/${id}/read`),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

export const blogAPI = {
  getAll: (params?: Record<string, string>) => api.get("/blogs", { params }),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
  create: (data: any) => api.post("/blogs", data),
  update: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
};
