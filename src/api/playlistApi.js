import asyncHandler from "../utils/asyncHandler";
import { apiClient } from "./apiClient";

const PLAYLIST_BASE_URL = "/api/v1/playlist";

const createPlaylist = (data) =>
  asyncHandler(async () => {
    const res = await apiClient.post(`${PLAYLIST_BASE_URL}/create`, data);
    return res.data;
  });

const getUserPlaylists = (userId) =>
  asyncHandler(async () => {
    const res = await apiClient.get(`${PLAYLIST_BASE_URL}/user/${userId}`);
    return res.data;
  });

const getPlaylistById = (playlistId) =>
  asyncHandler(async () => {
    const res = await apiClient.get(`${PLAYLIST_BASE_URL}/${playlistId}`);
    return res.data;
  });

const addVideoToPlaylist = (playlistId, videoId) =>
  asyncHandler(async () => {
    const res = await apiClient.patch(`${PLAYLIST_BASE_URL}/add-video`, {
      playlistId,
      videoId,
    });
    return res.data;
  });

const removeVideoFromPlaylist = (playlistId, videoId) =>
  asyncHandler(async () => {
    const res = await apiClient.patch(`${PLAYLIST_BASE_URL}/remove-video`, {
      playlistId,
      videoId,
    });
    return res.data;
  });

const deletePlaylist = (playlistId) =>
  asyncHandler(async () => {
    const res = await apiClient.delete(`${PLAYLIST_BASE_URL}/delete/${playlistId}`);
    return res.data;
  });

const updatePlaylist = (playlistId, data) =>
  asyncHandler(async () => {
    const res = await apiClient.patch(`${PLAYLIST_BASE_URL}/update/${playlistId}`, data);
    return res.data;
  });

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
