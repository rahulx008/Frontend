import asyncHandler from "../utils/asyncHandler";
import { apiClient } from "./apiClient";


const VIDEO_BASE_URL = '/api/v1/videos';

const getVideoById = (videoId) => asyncHandler(async () => {
    const res = await apiClient.get(`${VIDEO_BASE_URL}/getvideo/${videoId}`);
    return res.data;
});

const publishVideo = (formData) => asyncHandler(async () => {
    const res = await apiClient.post(`${VIDEO_BASE_URL}/publish`, formData, {
        headers: { "Content-Type": 'multipart/form-data' }
    });
    return res.data;
});

const updateVideo = (videoId, formData) => asyncHandler(async () => {
    const res = await apiClient.patch(`${VIDEO_BASE_URL}/update/${videoId}`, formData, {
        headers: { "Content-Type": 'multipart/form-data' }
    });
    return res.data;
});

const deleteVideo = (videoId) => asyncHandler(async () => {
    const res = await apiClient.delete(`${VIDEO_BASE_URL}/delete/${videoId}`);
    return res.data;
});

const getAllVideos = (filters) => asyncHandler(async () => {

    console.log("Fetching videos with filters::", filters);
    
    const res = await apiClient.get(`${VIDEO_BASE_URL}/getAllVideos?${filters}`);
    return res.data;
});

const getRelatedVideos = (videoId) => asyncHandler(async () => {
    const res = await apiClient.get(`${VIDEO_BASE_URL}/relatedVideos?videoId=${videoId}`);
    return res.data;
});

export {
    deleteVideo,
    getAllVideos,
    getRelatedVideos, getVideoById,
    publishVideo,
    updateVideo
};

