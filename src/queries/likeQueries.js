import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleLikeOnVideo, toggleLikeOnComment, getLikedVideos } from "../api/likeApi.js";
import toast from "react-hot-toast";

export const useToggleLikeOnVideo = (videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleLikeOnVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries(["video", videoId]);
      toast.success("Like updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Must be logged in to like");
    }
  });
};

export const useToggleLikeOnComment = (commentId, videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleLikeOnComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      toast.success("Comment like updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update comment like");
    }
  });
};

export const useGetLikedVideos = (enabled = true) => {
  return useQuery({
    queryKey: ["liked_videos"],
    queryFn: getLikedVideos,
    enabled,
  });
};
