import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetVideoById, useGetRelatedVideos } from "../queries/videoQueries";
import { useGetComments, useCreateComment, useDeleteComment } from "../queries/commentQueries";
import { useToggleLikeOnVideo } from "../queries/likeQueries";
import {
  useGetUserPlaylists,
  useCreatePlaylist,
  useAddVideoToPlaylist,
  useRemoveVideoFromPlaylist
} from "../queries/playlistQueries";
import { subscribeChannel, unsubscribeChannel } from "../api/subscriptionApi";
import { useAuth } from "../context/authContext";
import { ThumbsUp, MessageSquare, Trash2, Calendar, Eye, Share2, Play, ListPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  // Get current video details
  const { data: videoData, isLoading: loadingVideo, error: videoError } = useGetVideoById(videoId);

  // Get related videos
  const { data: relatedVideosData } = useGetRelatedVideos(videoId);
  const relatedVideos = relatedVideosData?.pages?.flatMap(page => page?.data?.videos || page?.data || []) || [];

  // Get comments
  const { data: commentsData, isLoading: loadingComments } = useGetComments(videoId);
  const comments = commentsData?.data?.comments || [];

  // Toggle Like Mutation
  const toggleLikeMutation = useToggleLikeOnVideo(videoId);

  // Toggle Subscribe Mutation
  const toggleSubscribeMutation = useMutation({
    mutationFn: ({ username, isSubscribed }) => {
      if (isSubscribed) {
        return unsubscribeChannel(username);
      } else {
        return subscribeChannel(username);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["video", videoId]);
      toast.success("Subscription updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update subscription");
    }
  });

  // Create Comment Mutation
  const addCommentMutation = useCreateComment(videoId);

  // Delete Comment Mutation
  const deleteCommentMutation = useDeleteComment(videoId);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText, {
      onSuccess: () => setCommentText("")
    });
  };

  if (loadingVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-main">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (videoError || !videoData?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main text-text-main p-6">
        <h2 className="text-2xl font-bold text-danger mb-4">Video Not Found</h2>
        <p className="text-text-sub mb-6">The video you are looking for might have been removed or is unavailable.</p>
        <button onClick={() => navigate("/")} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition cursor-pointer">
          Go Back Home
        </button>
      </div>
    );
  }

  // The aggregator in the backend sends `video` as an array or object in videoData.data
  const video = Array.isArray(videoData.data) ? videoData.data[0] : videoData.data;
  const isOwnerSubscribed = video?.owner?.isSubscribed;
  const isVideoLiked = video?.isLiked;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-4 md:p-6 text-left transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Meta */}
        <div className="lg:col-span-2 flex flex-col gap-4 text-left">
          {/* Player */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-border-main">
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-main mt-2">
            {video.title}
          </h1>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-main">
            {/* Owner/Channel info */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate(`/channel/${video.owner?.username}`)}
                className="w-12 h-12 rounded-full overflow-hidden border border-border-main bg-surface cursor-pointer flex-shrink-0 flex items-center justify-center text-text-main font-bold uppercase text-lg"
              >
                {video.owner?.avatar ? (
                  <img src={video.owner.avatar} alt={video.owner.username} className="w-full h-full object-cover" />
                ) : (
                  video.owner?.username?.charAt(0)
                )}
              </div>
              <div>
                <h3
                  onClick={() => navigate(`/channel/${video.owner?.username}`)}
                  className="font-semibold text-text-main hover:text-primary cursor-pointer leading-tight"
                >
                  {video.owner?.fullName || video.owner?.username}
                </h3>
                <p className="text-sm text-text-sub">
                  {video.owner?.subscribersCount || 0} subscribers
                </p>
              </div>
              {/* Subscribe button */}
              {user?.username !== video.owner?.username && (
                <button
                  onClick={() => toggleSubscribeMutation.mutate({ username: video.owner?.username, isSubscribed: isOwnerSubscribed })}
                  disabled={toggleSubscribeMutation.isLoading}
                  className={`ml-4 px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${isOwnerSubscribed
                    ? "bg-surface hover:bg-surface-hover text-text-sub border border-border-main"
                    : "bg-primary hover:bg-primary-hover text-white"
                    }`}
                >
                  {isOwnerSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>

            {/* Like & Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLikeMutation.mutate()}
                disabled={toggleLikeMutation.isLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition cursor-pointer ${isVideoLiked
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-surface hover:bg-surface-hover text-text-sub border border-border-main"
                  }`}
              >
                <ThumbsUp className={`h-4 w-4 ${isVideoLiked ? "fill-current" : ""}`} />
                <span>{video.likesCount || 0}</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border-main rounded-full text-sm font-medium transition text-text-sub cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("Please login to save to playlist");
                    return;
                  }
                  setShowPlaylistModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border-main rounded-full text-sm font-medium transition text-text-sub cursor-pointer"
              >
                <ListPlus className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Video Description Box */}
          <div className="bg-surface p-4 rounded-xl border border-border-main text-sm leading-relaxed mt-2">
            <div className="flex items-center gap-4 text-text-sub text-xs font-semibold mb-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {video.views || 0} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {new Date(video.createdAt).toLocaleDateString()}
              </span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                {video.category}
              </span>
            </div>
            <p className="text-text-secondary whitespace-pre-line font-light">
              {video.description || "No description provided."}
            </p>
          </div>

          {/* Comments Section */}
          <div className="mt-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments ({comments.length})
            </h3>

            {/* Comment input form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start mt-2">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold uppercase flex-shrink-0 border border-border-main">
                {user?.username ? user.username.charAt(0) : "?"}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-surface border border-border-main rounded-xl p-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                />
                <div className="flex justify-end gap-2">
                  {commentText.trim() && (
                    <button
                      type="button"
                      onClick={() => setCommentText("")}
                      className="px-4 py-1.5 rounded-lg text-sm text-text-sub hover:text-text-main transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={addCommentMutation.isLoading || !commentText.trim()}
                    className="px-5 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="flex flex-col gap-4 mt-4 divide-y divide-border-main">
              {loadingComments ? (
                <div className="text-center py-6 text-text-sub">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-text-sub text-sm font-light">No comments yet. Be the first to comment!</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 items-start pt-4 group">
                    <div className="w-10 h-10 rounded-full bg-surface text-text-sub flex items-center justify-center font-semibold uppercase flex-shrink-0 border border-border-main">
                      {comment.owner?.avatar ? (
                        <img src={comment.owner.avatar} alt={comment.owner?.username} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        comment.owner?.username?.charAt(0) || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-text-main">
                          {comment.owner?.fullName || comment.owner?.username || "Deleted User"}
                        </span>
                        <span className="text-xs text-text-muted">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1 font-light leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    {/* Delete button if user matches */}
                    {isAuthenticated && user?._id === comment.owner?._id && (
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this comment?")) {
                            deleteCommentMutation.mutate(comment._id, {
                              onSuccess: () => {
                                toast.success("Comment deleted");
                              },
                              onError: (err) => {
                                toast.error(err?.message || "Failed to delete comment");
                              }
                            });
                          }
                        }}
                        disabled={deleteCommentMutation.isLoading}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-danger/10 text-text-muted hover:text-danger rounded-lg transition flex-shrink-0 cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Related Videos */}
        <div className="flex flex-col gap-4 text-left">
          <h2 className="text-lg font-bold text-text-main tracking-tight flex items-center gap-2">
            <Play className="h-4.5 w-4.5 text-primary" />
            Related Videos
          </h2>
          <div className="flex flex-col gap-3">
            {relatedVideos.length === 0 ? (
              <p className="text-text-muted text-sm font-light py-4">No related videos found.</p>
            ) : (
              relatedVideos.slice(0, 10).map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/watch/${item._id}`)}
                  className="flex gap-3 bg-surface hover:bg-surface-hover p-2 rounded-xl border border-border-main cursor-pointer transition"
                >
                  <div className="w-32 aspect-video bg-border-main rounded-lg overflow-hidden flex-shrink-0 relative">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded font-mono">
                      {item.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-semibold text-sm text-text-main line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-text-sub mt-1 truncate">
                        {item.owner?.username || item.owner?.fullName}
                      </p>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      {item.views || 0} views
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Save to Playlist Modal */}
      {showPlaylistModal && (
        <PlaylistModal
          videoId={videoId}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
}

function PlaylistModal({ videoId, onClose }) {
  const { user } = useAuth();
  const { data: playlistsData, isLoading } = useGetUserPlaylists(user?._id);
  const addVideoMutation = useAddVideoToPlaylist();
  const removeVideoMutation = useRemoveVideoFromPlaylist();
  const createPlaylistMutation = useCreatePlaylist();

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const playlists = playlistsData?.data || [];

  const handleCheckboxChange = (playlist) => {
    const isVideoInPlaylist = playlist.videos?.includes(videoId);
    if (isVideoInPlaylist) {
      removeVideoMutation.mutate({ playlistId: playlist._id, videoId });
    } else {
      addVideoMutation.mutate({ playlistId: playlist._id, videoId });
    }
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylistMutation.mutate(
      { name: newPlaylistName.trim(), description: "" },
      {
        onSuccess: (res) => {
          // Auto-add video to the newly created playlist
          const newPlaylistId = res?.data?._id;
          if (newPlaylistId) {
            addVideoMutation.mutate({ playlistId: newPlaylistId, videoId });
          }
          setNewPlaylistName("");
          setShowCreateForm(false);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border-main w-full max-w-sm rounded-2xl shadow-2xl p-6 text-left relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-main">
          <h3 className="text-sm font-bold text-text-main">Save to playlist</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 pr-1 mb-4 flex flex-col gap-2 max-h-60">
            {playlists.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center">No playlists created yet.</p>
            ) : (
              playlists.map((playlist) => {
                const isChecked = playlist.videos?.includes(videoId);
                return (
                  <label
                    key={playlist._id}
                    className="flex items-center gap-3 py-1.5 px-2 hover:bg-surface-hover rounded-lg cursor-pointer text-sm text-text-main transition"
                  >
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={() => handleCheckboxChange(playlist)}
                      className="rounded border-border-main text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="truncate">{playlist.name}</span>
                  </label>
                );
              })
            )}
          </div>
        )}

        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-2 border border-dashed border-border-main hover:border-primary text-text-secondary hover:text-primary transition rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="text-sm font-medium">+</span> Create new playlist
          </button>
        ) : (
          <form onSubmit={handleCreatePlaylist} className="border-t border-border-main pt-4 flex flex-col gap-3">
            <input
              type="text"
              required
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="w-full bg-bg-main border border-border-main rounded-xl px-3 py-2 text-xs text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1.5 text-xs text-text-sub hover:text-text-main cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPlaylistMutation.isLoading}
                className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
