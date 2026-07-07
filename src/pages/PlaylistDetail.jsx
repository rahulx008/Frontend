import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPlaylistById,
  useRemoveVideoFromPlaylist,
  useDeletePlaylist,
  useUpdatePlaylist,
} from "../queries/playlistQueries";
import { ListVideo, Trash2, Edit2, Play, Eye, Clock } from "lucide-react";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const { data: playlistData, isLoading } = useGetPlaylistById(playlistId);
  const removeVideoMutation = useRemoveVideoFromPlaylist();
  const deletePlaylistMutation = useDeletePlaylist();
  const updatePlaylistMutation = useUpdatePlaylist();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const playlist = playlistData?.data;

  const handleStartEdit = () => {
    if (playlist) {
      setEditName(playlist.name);
      setEditDesc(playlist.description || "");
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updatePlaylistMutation.mutate(
      {
        playlistId,
        name: editName.trim(),
        description: editDesc.trim(),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDeletePlaylist = () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylistMutation.mutate(playlistId, {
        onSuccess: () => {
          navigate("/playlists");
        },
      });
    }
  };

  const handleRemoveVideo = (videoId) => {
    if (window.confirm("Remove this video from the playlist?")) {
      removeVideoMutation.mutate({ playlistId, videoId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-bg-main text-text-main">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-bg-main text-text-main p-6 text-center">
        <h2 className="text-2xl font-bold text-danger mb-2">Playlist Not Found</h2>
        <p className="text-text-sub text-sm mb-6">The playlist you are looking for does not exist or has been deleted.</p>
        <button
          onClick={() => navigate("/playlists")}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          Back to Playlists
        </button>
      </div>
    );
  }

  const videos = playlist.videos || [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-4 md:p-6 text-left transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Side: Playlist Meta Detail Card */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-surface border border-border-main p-6 rounded-2xl shadow-sm flex flex-col sticky top-20">
            <div className="w-full aspect-video rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-border-main relative overflow-hidden">
              {videos[0]?.thumbnail ? (
                <img
                  src={videos[0].thumbnail}
                  alt={playlist.name}
                  className="w-full h-full object-cover blur-sm opacity-50 absolute inset-0"
                />
              ) : null}
              <ListVideo className="h-16 w-16 relative z-10" />
              {videos.length > 0 && (
                <button
                  onClick={() => navigate(`/watch/${videos[0]._id}`)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-200 text-white gap-2 font-semibold text-sm cursor-pointer z-20"
                >
                  <Play className="h-6 w-6 fill-current" /> Play All
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="text-left flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h2 className="font-extrabold text-2xl text-text-main leading-tight truncate">
                    {playlist.name}
                  </h2>
                  <button
                    onClick={handleStartEdit}
                    className="p-1 text-text-muted hover:text-primary transition cursor-pointer"
                    title="Edit details"
                  >
                    <Edit2 className="h-4.5 w-4.5" />
                  </button>
                </div>
                <p className="text-sm text-text-sub font-light whitespace-pre-line leading-relaxed mb-6">
                  {playlist.description || "No description provided."}
                </p>
                <div className="text-xs text-text-muted flex flex-col gap-1.5 font-medium border-t border-border-main pt-4 mb-6">
                  <p>{videos.length} videos</p>
                  <p>Created by @{playlist.owner?.username}</p>
                </div>
                <button
                  onClick={handleDeletePlaylist}
                  className="w-full py-2.5 bg-danger/10 hover:bg-danger/25 text-danger font-semibold rounded-xl transition cursor-pointer text-xs flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-4 w-4" /> Delete Playlist
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 text-left">
                <div>
                  <label className="text-xs font-semibold text-text-sub uppercase tracking-wider block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-bg-main border border-border-main rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-sub uppercase tracking-wider block mb-1">
                    Description
                  </label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-bg-main border border-border-main rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary resize-none h-24"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs text-text-sub hover:text-text-main font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatePlaylistMutation.isLoading}
                    className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Videos List */}
        <div className="flex-1">
          {videos.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border-main shadow-sm h-full flex flex-col items-center justify-center">
              <ListVideo className="h-12 w-12 text-text-muted mb-3" />
              <p className="text-text-sub text-lg font-medium">This playlist has no videos</p>
              <p className="text-text-muted text-sm mt-1">Browse videos and click "Save" to populate this playlist.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {videos.map((video, index) => (
                <div
                  key={video._id}
                  className="group flex gap-4 bg-surface hover:bg-surface-hover p-3 rounded-2xl border border-border-main relative transition duration-200"
                >
                  <span className="self-center text-text-muted text-sm font-semibold w-6 text-center">
                    {index + 1}
                  </span>
                  <div
                    onClick={() => navigate(`/watch/${video._id}`)}
                    className="w-36 md:w-44 aspect-video bg-border-main rounded-xl overflow-hidden flex-shrink-0 relative cursor-pointer"
                  >
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    {video.duration && (
                      <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] text-white px-1.5 py-0.5 rounded font-mono">
                        {video.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1 text-left">
                    <div onClick={() => navigate(`/watch/${video._id}`)} className="cursor-pointer">
                      <h4 className="font-bold text-sm md:text-base text-text-main line-clamp-2 leading-snug group-hover:text-primary transition">
                        {video.title}
                      </h4>
                      <p className="text-xs text-text-sub mt-1">
                        {video.owner?.fullName || video.owner?.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-text-muted font-medium mt-2">
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {video.views || 0} views</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveVideo(video._id)}
                    className="self-center p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition cursor-pointer flex-shrink-0"
                    title="Remove from playlist"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
