import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Info, PlaySquare, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { subscribeChannel, unsubscribeChannel } from "../api/subscriptionApi";
import { getUserVideos, updateAvatar, updateCoverImage } from "../api/userApi";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/authContext";
import { useGetUserChannelInfo } from "../queries/userQueries";

export default function Channel() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("videos");

  // Fetch channel details
  const { data: channelData, isLoading: loadingChannel, error } = useGetUserChannelInfo(username);
  const channel = channelData?.data;

  // Fetch channel owner's videos
  const { data: videosData, isLoading: loadingVideos } = useQuery({
    queryKey: ["channel_videos", channel?._id],
    queryFn: () => getUserVideos(channel._id, ""),
    enabled: !!channel?._id,
  });

  const videos = videosData?.data?.videos || videosData?.data || [];

  // Toggle subscription
  const toggleSubscribeMutation = useMutation({
    mutationFn: () => {
      if (channel?.isSubscribed) {
        return unsubscribeChannel(channel.username);
      } else {
        return subscribeChannel(channel.username);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", username]);
      toast.success("Subscription updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update subscription");
    }
  });

  // Update Avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: (formData) => updateAvatar(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", username]);
      queryClient.invalidateQueries(["currentUser"]);
      toast.success("Avatar updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update avatar");
    }
  });

  // Update Cover Image mutation
  const updateCoverImageMutation = useMutation({
    mutationFn: (formData) => updateCoverImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", username]);
      queryClient.invalidateQueries(["currentUser"]);
      toast.success("Cover banner updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update cover image");
    }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    updateAvatarMutation.mutate(formData);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("coverImage", file);
    updateCoverImageMutation.mutate(formData);
  };

  if (loadingChannel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-main">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main text-text-main p-6">
        <h2 className="text-2xl font-bold text-danger mb-4">Channel Not Found</h2>
        <p className="text-text-sub mb-6">The channel @{username} does not exist or has been disabled.</p>
        <button onClick={() => navigate("/")} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition cursor-pointer">
          Go Back Home
        </button>
      </div>
    );
  }

  const isOwnChannel = currentUser?.username === channel.username;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main text-left transition-colors duration-200">
      {/* Banner / Cover Image */}
      <div className="relative h-44 md:h-64 w-full bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden group">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="Channel Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted font-light bg-gradient-to-r from-blue-950/80 via-surface to-indigo-950/80">
            {/* Elegant placeholder */}
          </div>
        )}

        {isOwnChannel && (
          <label className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 border border-border-main px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition">
            <Camera className="h-4 w-4" />
            Edit Banner
            <input type="file" onChange={handleCoverChange} className="hidden" accept="image/*" />
          </label>
        )}
      </div>

      {/* Channel Header Details */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-border-main pb-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* Avatar */}
            <div className="relative group w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-border-main bg-surface flex-shrink-0 flex items-center justify-center text-text-main font-bold uppercase text-4xl">
              {channel.avatar ? (
                <img src={channel.avatar} alt={channel.username} className="w-full h-full object-cover" />
              ) : (
                channel.username?.charAt(0)
              )}

              {isOwnChannel && (
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition duration-200">
                  <Camera className="h-6 w-6 text-white" />
                  <input type="file" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            {/* Title & Stats */}
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight leading-tight">
                {channel.fullName || channel.username}
              </h1>
              <p className="text-text-sub text-sm mt-1 flex items-center gap-1.5 font-light">
                @{channel.username}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-text-muted text-xs mt-3 font-semibold">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {channel.subscribersCount || 0} subscribers
                </span>
                <span>•</span>
                <span>
                  {channel.channelsSubscribedToCount || 0} subscribed channels
                </span>
              </div>
            </div>
          </div>

          {/* Action button: Subscribe or Edit Profile */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isOwnChannel ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-md transition text-center cursor-pointer"
              >
                Go to Creator Studio
              </button>
            ) : (
              <button
                onClick={() => toggleSubscribeMutation.mutate()}
                disabled={toggleSubscribeMutation.isLoading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold transition cursor-pointer ${channel.isSubscribed
                    ? "bg-surface hover:bg-surface-hover text-text-sub border border-border-main"
                    : "bg-text-main text-bg-main hover:opacity-90"
                  }`}
              >
                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-border-main mt-6">
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${activeTab === "videos"
                ? "border-primary text-primary"
                : "border-transparent text-text-sub hover:text-text-main"
              }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${activeTab === "about"
                ? "border-primary text-primary"
                : "border-transparent text-text-sub hover:text-text-main"
              }`}
          >
            About
          </button>
        </div>

        {/* Tab contents */}
        <div className="py-6">
          {activeTab === "videos" ? (
            loadingVideos ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-20 bg-surface rounded-xl border border-border-main">
                <PlaySquare className="h-12 w-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-sub text-base font-light">This channel has no videos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    channel={channel.fullName || channel.username}
                    views={video.views}
                    uploadedAt={new Date(video.createdAt).toLocaleDateString()}
                    duration={video.duration}
                    avatar={channel.avatar}
                    onClick={() => navigate(`/watch/${video._id}`)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="bg-surface rounded-2xl p-6 border border-border-main max-w-2xl text-left">
              <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-primary" />
                Channel Description
              </h3>
              <p className="text-text-secondary font-light leading-relaxed">
                Welcome to @{channel.username}'s channel on Clipster! Explore tutorials, gameplay, music, podcasts, or courses shared here.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 text-sm border-t border-border-main pt-6">
                <div className="flex justify-between text-text-muted">
                  <span>Joined</span>
                  <span className="text-text-secondary font-semibold">{new Date(channel.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Email</span>
                  <span className="text-text-secondary font-semibold">{channel.email || "Private"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
