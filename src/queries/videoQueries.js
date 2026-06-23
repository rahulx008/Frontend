import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteVideo,
    getAllVideos,
    getRelatedVideos,
    getVideoById,
    publishVideo,
    updateVideo
} from "../api/videoApi.js";

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
      // queryClient.invalidateQueries({ queryKey: ['watch_history'] });
      // queryClient.invalidateQueries({ queryKey: ['stats'] });
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


const useFetchVideos = (searchParams) => {

    const limit = searchParams.get('limit')||10;
    console.log(limit);

    console.log("searchParams: Fetch::", searchParams.toString());
    return useInfiniteQuery({
        queryKey: ['videos', searchParams.toString()],
        queryFn: ({ pageParam = 1 }) => getAllVideos(`${searchParams.toString()}&limit=10&page=${pageParam}`),
        getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    })
}

const useGetAllVideos = (limit = 10) => {
    
    return useInfiniteQuery({
        queryKey: ['videos', { limit }],
        queryFn: ({ pageParam = 1 }) => getAllVideos(`limit=${limit}&page=${pageParam}`),
        getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    })
}

const useGetRelatedVideos = (videoId) => {
    return useInfiniteQuery({
        queryKey: ['videos', 'related_videos', { videoId }],
        queryFn: () => getRelatedVideos(videoId),
        getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
        keepPreviousData: true,
    })
}

export {
    useDeleteVideo, useFetchVideos,
    useGetAllVideos,
    useGetRelatedVideos, useGetVideoById, usePublishVideo, useUpdateVideo
};

