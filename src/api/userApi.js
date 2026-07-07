import asyncHandler  from "../utils/AsyncHandler.js";
import {apiClient} from "./apiClient"

const USER_BASE_URL = '/api/v1/users'

// const server = ()=> asyncHandler(async()=>{
//     const res = await apiClient.get('/api/v1/server')
//     return res.data;
// })

// Fetches user channel information based on username
const getUserChannelInfo = (username) => asyncHandler(async () => {
    const response = await apiClient.post(`${USER_BASE_URL}/get-channel-details/${username}`)
    return response.data;
})

// Fetches videos of a user with applied filters
const getUserVideos = (userId, filters) => asyncHandler(async () => {
    const res = await apiClient.get(`/api/v1/videos/getAllVideos?userId=${userId}&${filters}`)
    return res.data
})

// Logs in the user with provided data
const loginUser = (data) => asyncHandler(async () => {
    const res = await apiClient.post(`${USER_BASE_URL}/login`, data)
    return res.data
})

// Registers a new user with the provided form data
const registerUser = (formData) => asyncHandler(async () => {
    const res = await apiClient.post(`${USER_BASE_URL}/register`, formData, {
    headers: { "Content-Type": 'multipart/form-data' }
    })
    return res.data
})

// Logs out the current user
const logoutUser = () => asyncHandler(async () => {
    const res = await apiClient.post(`${USER_BASE_URL}/logout`)
    return res.data
})

// Fetches current logged-in user information
const getCurrentUser = () => asyncHandler(async () => {
    const res = await apiClient.get(`${USER_BASE_URL}/get-current-user`);
    return res.data;
})

// Fetches user's watch history with pagination
const getUserWatchHistory = (limit = 3, page = 1) => asyncHandler(async () => {
    const res = await apiClient.get(`${USER_BASE_URL}/get-watch-history?limit=${limit}&page=${page}`)
    return res.data
})

// Changes user's password with the provided data
const changePassword = (body) => asyncHandler(async () => {
    const res = await apiClient.post(`${USER_BASE_URL}/update-user-password`, body)
    return res.data
})

// Updates user account details with new information
const updateAccountDetails = (details) => asyncHandler(async () => {
    const res = await apiClient.patch(`${USER_BASE_URL}/update-account-details`, details)
    return res.data
})

// Clears user's watch history
const clearWatchHistory = () => asyncHandler(async () => {
    const res = await apiClient.delete(`${USER_BASE_URL}/clear-watch-history`);
    return res.data
})

// Updates user's avatar with the provided file
const updateAvatar = (avatar) => asyncHandler(async () => {
    const res = await apiClient.patch(`${USER_BASE_URL}/update-avatar`, avatar,
        { headers: { "Content-Type": 'multipart/form-data' } }
    )
    return res.data
})

// Updates user's cover image with the provided file
const updateCoverImage = (coverImage) => asyncHandler(async () => {
    const res = await apiClient.patch(`${USER_BASE_URL}/update-cover-image`, coverImage,
        { headers: { "Content-Type": 'multipart/form-data' } }
    )
    return res.data
})

const searchUser = (query) => asyncHandler(async () => {
    const res = await apiClient.get(`${USER_BASE_URL}/search?query=${query}`)
    return res.data;
})

export {
    // server,
    getUserChannelInfo,
    getUserVideos,
    loginUser,
    logoutUser,
    getCurrentUser,
    getUserWatchHistory,
    changePassword,
    updateAccountDetails,
    clearWatchHistory,
    registerUser,
    updateAvatar,
    updateCoverImage,
    searchUser
}