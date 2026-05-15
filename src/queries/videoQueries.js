import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getVideoById,
    publishVideo,
    updateVideo,
    deleteVideo,
    getAllVideos,
    getRelatedVideos 
} from "../api/videoApi.js";

const usePublishVideo = () => {
    return useMutation({
        mutationFn: (formData) => publishVideo(formData)
    })
}