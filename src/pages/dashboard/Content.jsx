import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/authContext";
import { getUserVideos } from "../../api/userApi";
import { publishVideo, updateVideo, deleteVideo } from "../../api/videoApi";
import { 
  Plus, Edit, Trash2, Video, FileText, Upload, X, Globe, Eye, EyeOff 
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "trending", "shopping", "music", "movies", "gaming", 
  "sports", "courses", "fashion", "podcasts", "news", "others"
];

export default function Content() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Forms state
  const [uploadForm, setUploadForm] = useState({
    title: "", description: "", category: "trending", video: null, thumbnail: null
  });
  const [editForm, setEditForm] = useState({
    id: "", title: "", description: "", category: "trending", thumbnail: null
  });

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch creator's videos
  const { data: videosData, isLoading } = useQuery({
    queryKey: ["creator_videos", user?._id],
    queryFn: () => getUserVideos(user._id, ""),
    enabled: !!user?._id,
  });

  const videos = videosData?.data?.videos || videosData?.data || [];

  // Delete Video Mutation
  const deleteMutation = useMutation({
    mutationFn: (videoId) => deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries(["creator_videos", user?._id]);
      toast.success("Video deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete video");
    }
  });

  // Publish Video
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim() || !uploadForm.description.trim() || !uploadForm.video || !uploadForm.thumbnail) {
      toast.error("Please fill in all fields and upload both video and thumbnail files.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("description", uploadForm.description);
    formData.append("category", uploadForm.category);
    formData.append("video", uploadForm.video);
    formData.append("thumbnail", uploadForm.thumbnail);

    try {
      await publishVideo(formData);
      toast.success("Video published successfully!");
      setShowUploadModal(false);
      setUploadForm({ title: "", description: "", category: "trending", video: null, thumbnail: null });
      queryClient.invalidateQueries(["creator_videos", user?._id]);
    } catch (err) {
      toast.error(err?.message || "Error publishing video");
    } finally {
      setUploading(false);
    }
  };

  // Edit Video Details
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.thumbnail) {
      toast.error("Please fill in all fields. Note: A new thumbnail image is required by the backend to update details.");
      return;
    }

    setUpdating(true);
    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    formData.append("category", editForm.category);
    formData.append("thumbnail", editForm.thumbnail);

    try {
      await updateVideo(editForm.id, formData);
      toast.success("Video updated successfully!");
      setShowEditModal(false);
      setEditForm({ id: "", title: "", description: "", category: "trending", thumbnail: null });
      queryClient.invalidateQueries(["creator_videos", user?._id]);
    } catch (err) {
      toast.error(err?.message || "Error updating video");
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = (video) => {
    setEditForm({
      id: video._id,
      title: video.title,
      description: video.description,
      category: video.category || "trending",
      thumbnail: null
    });
    setShowEditModal(true);
  };

  return (
    <div className="p-6 md:p-8 bg-bg-main text-text-main min-h-screen text-left transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight flex items-center gap-2">
              <Video className="h-7 w-7 text-primary" />
              Channel Content
            </h1>
            <p className="text-text-sub text-sm mt-1 font-light">Manage your channel's uploaded videos and details</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-lg hover:scale-[1.02] active:scale-100 transition cursor-pointer text-sm"
          >
            <Plus className="h-4.5 w-4.5" />
            Upload Video
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border-main flex flex-col items-center justify-center">
            <Upload className="h-16 w-16 text-text-muted mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-text-main mb-1">No videos uploaded yet</h3>
            <p className="text-text-sub text-sm max-w-sm mb-6 font-light">Upload your first video to start growing your channel and sharing content.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-md transition cursor-pointer text-sm"
            >
              Upload a Video
            </button>
          </div>
        ) : (
          /* Videos Table */
          <div className="bg-surface border border-border-main rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-main bg-surface-sidebar/40 text-xs font-semibold uppercase text-text-sub tracking-wider">
                    <th className="py-4 px-6">Video</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Views</th>
                    <th className="py-4 px-6">Date Uploaded</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {videos.map((vid) => (
                    <tr key={vid._id} className="hover:bg-surface-hover transition">
                      <td className="py-4 px-6 max-w-xs md:max-w-sm">
                        <div className="flex gap-4 items-start">
                          <div className="w-24 aspect-video bg-bg-main rounded-md overflow-hidden flex-shrink-0 border border-border-main">
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-text-main truncate" title={vid.title}>
                              {vid.title}
                            </h4>
                            <p className="text-xs text-text-sub line-clamp-1 mt-1 font-light">
                              {vid.description || "No description."}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary capitalize">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-bg-main text-text-sub border border-border-main">
                          {vid.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary">
                        {vid.views || 0}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-sub">
                        {new Date(vid.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openEditModal(vid)}
                            className="p-2 hover:bg-primary/10 text-text-sub hover:text-primary rounded-lg transition cursor-pointer"
                            title="Edit details"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this video? This cannot be undone.")) {
                                deleteMutation.mutate(vid._id);
                              }
                            }}
                            className="p-2 hover:bg-danger/10 text-text-sub hover:text-danger rounded-lg transition cursor-pointer"
                            title="Delete video"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Upload Video Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-main rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-main">
              <h2 className="text-lg font-bold text-text-main">Upload video</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-text-sub hover:text-text-main rounded-lg hover:bg-surface-hover transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="p-6 flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-sub">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter video title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="bg-bg-main border border-border-main rounded-lg p-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-sub">Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter video description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="bg-bg-main border border-border-main rounded-lg p-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-sub">Category</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="bg-bg-main border border-border-main rounded-lg p-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-surface capitalize">{cat}</option>
                  ))}
                </select>
              </div>

              {/* File Uploads Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Video File */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-sub">Video File</label>
                  <label className="border border-dashed border-border-main hover:border-primary bg-bg-main rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition">
                    <Upload className="h-5 w-5 text-text-muted" />
                    <span className="text-xs text-text-secondary font-semibold truncate max-w-full">
                      {uploadForm.video ? uploadForm.video.name : "Select video file"}
                    </span>
                    <input
                      type="file"
                      required
                      accept="video/*"
                      onChange={(e) => setUploadForm({ ...uploadForm, video: e.target.files[0] })}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Thumbnail File */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-sub">Thumbnail Image</label>
                  <label className="border border-dashed border-border-main hover:border-primary bg-bg-main rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition">
                    <Upload className="h-5 w-5 text-text-muted" />
                    <span className="text-xs text-text-secondary font-semibold truncate max-w-full">
                      {uploadForm.thumbnail ? uploadForm.thumbnail.name : "Select cover image"}
                    </span>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => setUploadForm({ ...uploadForm, thumbnail: e.target.files[0] })}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-border-main pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 bg-surface hover:bg-surface-hover text-text-sub font-semibold rounded-lg text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    "Publish Video"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Video Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-main rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-main">
              <h2 className="text-lg font-bold text-text-main">Edit video details</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 text-text-sub hover:text-text-main rounded-lg hover:bg-surface-hover transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-sub">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="bg-bg-main border border-border-main rounded-lg p-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-sub">Description</label>
                <textarea
                  required
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="bg-bg-main border border-border-main rounded-lg p-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-sub">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="bg-bg-main border border-border-main rounded-lg p-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-surface capitalize">{cat}</option>
                  ))}
                </select>
              </div>

              {/* New Thumbnail (required by backend) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-sub">New Thumbnail Image <span className="text-danger">*</span></label>
                <label className="border border-dashed border-border-main hover:border-primary bg-bg-main rounded-lg p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition">
                  <Upload className="h-5 w-5 text-text-muted" />
                  <span className="text-xs text-text-secondary font-semibold truncate max-w-full">
                    {editForm.thumbnail ? editForm.thumbnail.name : "Select replacement cover image"}
                  </span>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.files[0] })}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-text-muted font-light">Note: The server requires uploading a new thumbnail image to update video metadata.</span>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-border-main pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 bg-surface hover:bg-surface-hover text-text-sub font-semibold rounded-lg text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition cursor-pointer"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
