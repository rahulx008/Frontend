import asyncHandler from "../utils/AsyncHandler";
import { apiClient } from "./apiClient";

const LIKE_BASE_URL = '/api/v1/likes'


const toggleLikeOnComment = (commentId) => asyncHandler(async () => {
    const res = await apiClient.patch(`${LIKE_BASE_URL}/toggleLikeOnComment?commentId=${commentId}`);
    return res.data;
})

const toggleLikeOnVideo = (videoId) => asyncHandler(async () => {
    const res = await apiClient.patch(`${LIKE_BASE_URL}/toggleLikeOnVideo?videoId=${videoId}`);
    return res.data;
})

export {
    toggleLikeOnComment,
    toggleLikeOnVideo
}