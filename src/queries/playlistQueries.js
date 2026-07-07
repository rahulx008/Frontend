import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../api/playlistApi.js";
import toast from "react-hot-toast";

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists"]);
      toast.success("Playlist created successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create playlist");
    },
  });
};

export const useGetUserPlaylists = (userId, enabled = true) => {
  return useQuery({
    queryKey: ["playlists", userId],
    queryFn: () => getUserPlaylists(userId),
    enabled: !!userId && enabled,
  });
};

export const useGetPlaylistById = (playlistId) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistById(playlistId),
    enabled: !!playlistId,
  });
};

export const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, videoId }) => addVideoToPlaylist(playlistId, videoId),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(["playlists"]);
      queryClient.invalidateQueries(["playlist", variables.playlistId]);
      toast.success("Video added to playlist");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to add video to playlist");
    },
  });
};

export const useRemoveVideoFromPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, videoId }) =>
      removeVideoFromPlaylist(playlistId, videoId),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(["playlists"]);
      queryClient.invalidateQueries(["playlist", variables.playlistId]);
      toast.success("Video removed from playlist");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to remove video from playlist");
    },
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playlistId) => deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists"]);
      toast.success("Playlist deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete playlist");
    },
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, name, description }) =>
      updatePlaylist(playlistId, { name, description }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(["playlists"]);
      queryClient.invalidateQueries(["playlist", variables.playlistId]);
      toast.success("Playlist updated successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update playlist");
    },
  });
};
