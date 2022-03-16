import axios from 'axios';

const axiosApi = axios.create({
  baseURL: 'https://api.hailey.ai/api',
});

// Request interceptor for API calls
axiosApi.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = { 
        'Authorization': `Bearer ${token}`,
      }
    }
    return config;
  },
  error => {
    Promise.reject(error)
});

// if a 401 happens, when token is expired
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error && error.response && error.response.status === 401) {
      originalRequest._retry = true;

      axios.interceptors.response.eject();

      originalRequest.headers.token = 'jscanvas';

      return axios(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default axiosApi;
