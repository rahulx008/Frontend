import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getVideoById,
    publishVideo,
    updateVideo,
    deleteVideo,
    getAllVideos,
    getRelatedVideos 
} from "../api/videoApi.js";
import { use } from "react";

const usePublishVideo = () => {
    return useMutation({
        mutationFn: (formData) => publishVideo(formData)
        
    })
}

const useGetVideoById = (videoId) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      const data = await getVideoById(videoId);
      // Invalidate the user history query
    //   queryClient.invalidateQueries({ queryKey: ['watch_history'] });
    //   queryClient.invalidateQueries({ queryKey: ['stats'] });
      return data;
    },
  })
}
const useUpdateVideo = (videoId) => {
    return useMutation({
        mutationFn: (formData) => updateVideo(videoId, formData)
    })
}

const useDeleteVideo = (videoId) => {
    return useMutation({
        mutationFn: () => deleteVideo(videoId)
    })
}

const useGetAllVideos = (limit=10) => {
    return useInfiniteQuery({
        queryKey: ['videos', { limit }],
        queryFn: ({ pageParam = 1 }) => fetchAllVideos(`limit=${limit}&page=${pageParam}`),
        getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    })
}

const useGetRelatedVideos = (videoId) => {
    return useInfiniteQuery({
        queryKey: ['videos', 'related_videos', { videoId }],
        queryFn: ({ pageParam = 1 }) => getRelatedVideos(videoId, pageParam, limit),
        getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
        keepPreviousData: true,
    })
}