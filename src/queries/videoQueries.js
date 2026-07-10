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
    const queryStr = searchParams.toString();
    return useInfiniteQuery({
        queryKey: ['videos', queryStr],
        queryFn: ({ pageParam = null }) => {
            const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
            return getAllVideos(`${queryStr}&limit=10${cursorParam}`);
        },
        getNextPageParam: (lastPage) => lastPage?.data?.nextCursor || null,
        initialPageParam: null,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    })
}

const useGetAllVideos = (limit = 10) => {
    return useInfiniteQuery({
        queryKey: ['videos', { limit }],
        queryFn: ({ pageParam = null }) => {
            const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
            return getAllVideos(`limit=${limit}${cursorParam}`);
        },
        getNextPageParam: (lastPage) => lastPage?.data?.nextCursor || null,
        initialPageParam: null,
    })
}

const useGetRelatedVideos = (videoId) => {
    return useInfiniteQuery({
        queryKey: ['videos', 'related_videos', { videoId }],
        queryFn: () => getRelatedVideos(videoId),
        getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
        initialPageParam: 1,
        keepPreviousData: true,
    })
}

export {
    useDeleteVideo, useFetchVideos,
    useGetAllVideos,
    useGetRelatedVideos, useGetVideoById, usePublishVideo, useUpdateVideo
};

