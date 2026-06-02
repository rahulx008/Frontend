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


const useFetchVideos = (
  searchParams,
  {
    limit = 10,
    ...queryOptions
  } = {}
) => {
  const queryString = new URLSearchParams({
    ...searchParams,
    limit,
  }).toString();

  return useInfiniteQuery({
    queryKey: ["videos", queryString],

    queryFn: ({ pageParam = null }) => {
      const params = new URLSearchParams({
        ...searchParams,
        limit,
      });

      if (pageParam) {
        params.set("cursor", pageParam);
      }

      return getAllVideos(params.toString());
    },

    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasMore
        ? lastPage.data.nextCursor
        : undefined,

    ...queryOptions,
  });
};

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

