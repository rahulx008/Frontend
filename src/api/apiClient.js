import axios from "axios";
import asyncHandler from "../utils/AsyncHandler";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ,
    withCredentials: true, // include cookies in requests
    headers: {
        "Content-Type": "application/json",
    },
});



// Interceptor to add an Authorization header with a Bearer token (if available) to every outgoing request.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    }, 
    (error) => {
        return Promise.reject(error)
    }
)

let isRefreshing = false;
let failedQueue = [];

// process queue of failed requests after token refresh 
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        }else{
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(

    // if response is successful, just return it
    (response) => response,

    async (error) => {

        // if there is no response (e.g., network error), reject the promise with the error
        // could be internet error, server down, etc.
        const originalRequest = error.config;
        if(!error.response){
            return Promise.reject(error);
        }

        //we'll use this to check if it is refresh request
        const isRefreshRequest = originalRequest.url.includes('/api/v1/users/refresh-access-token'); 


        if (error.response.status === 401 && !isRefreshRequest && !originalRequest._retry) {

            // if we are already refreshing, queue the request
            // return a promise that will resolve once the token is refreshed

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (token) {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    }
                    return Promise.reject(error);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Request a new access token using the refresh token
                const refreshResponse = await apiClient.post('/api/v1/users/refresh-access-token', {}, { withCredentials: true });

                const newAccessToken = refreshResponse.data.data.accessToken;

                localStorage.setItem('accessToken', newAccessToken);

                // Process all queued requests with the new token
                processQueue(null, newAccessToken);

                // Update the Authorization header with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Retry the original request with the new token
                return apiClient(originalRequest);

            }catch (refreshError) {
                // If the refresh token request fails, log the error and reject all queued requests
                console.error('Refresh token failed', refreshError);

                // Process queued requests with error
                processQueue(refreshError, null);

                console.error('Refresh token failed:', refreshError);

                // Clear local state immediately
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');

                // const { setUser } = getAuthSetters()
                // setUser(null);

                try {

                    //logout user method from user api
                    await logoutUser();
                } catch (logoutError) {
                    console.error('Logout failed:', logoutError);
                }

                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
    
)