import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateComment, UpdateComment, DeleteComment, getComments } from "../api/commentApi.js";
import toast from "react-hot-toast";

export const useGetComments = (videoId, enabled = true) => {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getComments(videoId),
    enabled: !!videoId && enabled,
  });
};

export const useCreateComment = (videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text) => CreateComment({ videoId, content: text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      toast.success("Comment added");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to add comment");
    }
  });
};

export const useDeleteComment = (videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => DeleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      toast.success("Comment deleted");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete comment");
    }
  });
};

export const useUpdateComment = (videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }) => UpdateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      toast.success("Comment updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update comment");
    }
  });
};
