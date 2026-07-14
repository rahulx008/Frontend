import asyncHandler from "../utils/asyncHandler";
import { apiClient } from "./apiClient";

const LIKE_BASE_URL = '/api/v1/likes'


const toggleLikeOnComment = (commentId) => asyncHandler(async () => {
    const res = await apiClient.patch(`${LIKE_BASE_URL}/toggleLikeOnComment`, { commentId });
    return res.data;
})

const toggleLikeOnVideo = (videoId) => asyncHandler(async () => {
    const res = await apiClient.patch(`${LIKE_BASE_URL}/toggleLikeOnVideo`, { videoId });
    return res.data;
})

const getLikedVideos = () => asyncHandler(async () => {
    const res = await apiClient.get(`${LIKE_BASE_URL}/get-liked-videos`);
    return res.data;
})

export {
    toggleLikeOnComment,
    toggleLikeOnVideo,
    getLikedVideos
}