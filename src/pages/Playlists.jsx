import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserPlaylists, useCreatePlaylist, useDeletePlaylist } from "../queries/playlistQueries";
import { useAuth } from "../context/authContext";
import { ListVideo, Trash2, FolderPlus } from "lucide-react";

export default function Playlists() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: playlistsData, isLoading } = useGetUserPlaylists(user?._id, isAuthenticated);
  const createPlaylistMutation = useCreatePlaylist();
  const deletePlaylistMutation = useDeletePlaylist();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");

  const playlists = playlistsData?.data || [];

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    createPlaylistMutation.mutate(
      {
        name: playlistName.trim(),
        description: playlistDesc.trim(),
      },
      {
        onSuccess: () => {
          setPlaylistName("");
          setPlaylistDesc("");
          setShowCreateModal(false);
        },
      }
    );
  };

  const handleDeletePlaylist = (e, playlistId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylistMutation.mutate(playlistId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-bg-main text-text-main p-6 text-center transition-colors duration-200">
        <div className="bg-surface border border-border-main p-8 rounded-2xl max-w-md w-full shadow-xl">
          <ListVideo className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">See your playlists</h2>
          <p className="text-text-sub text-sm mb-6 font-light">Playlists you create will be saved here. Sign in to view yours.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-lg transition cursor-pointer text-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-4 md:p-6 text-left transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-border-main pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-2 tracking-tight">
            <ListVideo className="h-7 w-7 text-primary" />
            Playlists
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-md"
          >
            <FolderPlus className="h-4 w-4" />
            Create Playlist
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border-main shadow-sm">
            <ListVideo className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-sub text-lg font-medium">No playlists found</p>
            <p className="text-text-muted text-sm mt-1 mb-6">Create a playlist to organize your videos.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Create First Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="group bg-surface hover:bg-surface-hover border border-border-main rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="p-5 text-left flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition duration-200">
                    <ListVideo className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-text-main line-clamp-1 mb-1 group-hover:text-primary transition">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2 font-light min-h-[32px] mb-4">
                    {playlist.description || "No description"}
                  </p>
                </div>
                <div className="flex justify-between items-center px-5 py-3.5 bg-bg-main/50 border-t border-border-main text-xs">
                  <span className="text-text-sub font-medium">
                    {playlist.videos?.length || 0} videos
                  </span>
                  <button
                    onClick={(e) => handleDeletePlaylist(e, playlist._id)}
                    className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition cursor-pointer"
                    title="Delete playlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border-main w-full max-w-md rounded-2xl shadow-2xl p-6 text-left relative">
            <h3 className="text-lg font-bold text-text-main mb-4 pb-2 border-b border-border-main">
              Create New Playlist
            </h3>
            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-text-sub uppercase tracking-wider block mb-1.5">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  required
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full bg-bg-main border border-border-main rounded-xl px-3 py-2 text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-sub uppercase tracking-wider block mb-1.5">
                  Description
                </label>
                <textarea
                  value={playlistDesc}
                  onChange={(e) => setPlaylistDesc(e.target.value)}
                  placeholder="Enter optional description"
                  className="w-full bg-bg-main border border-border-main rounded-xl px-3 py-2 text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-none h-24"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-border-main mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPlaylistName("");
                    setPlaylistDesc("");
                    setShowCreateModal(false);
                  }}
                  className="px-4 py-2 text-sm text-text-sub hover:text-text-main cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPlaylistMutation.isLoading}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold cursor-pointer shadow"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
