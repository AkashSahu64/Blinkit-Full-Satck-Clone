import axios from 'axios';
import SummaryApi, { baseUrl } from '../common/SummaryApi';


const Axios = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// Add a request interceptor to add the Authorization header with the access token 
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to check for the access token and refresh token
Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originalRequest);
                }
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async(refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        return accessToken;
    
    } catch (error) {
        return Promise.reject(error);
    }   
}

export default Axios;