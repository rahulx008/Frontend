import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getVideosFromSubscribedChannels } from "../api/subscriptionApi";
import { useGetAllVideos } from "../queries/videoQueries";
import { useAuth } from "../context/authContext";
import VideoCard from "../components/VideoCard";
import { Bell, TvMinimalPlay } from "lucide-react";

export default function Subscriptions() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Try to load subscription videos
  const { data: subVideosData, isLoading: loadingSub, error: subError } = useQuery({
    queryKey: ["subscription_videos"],
    queryFn: getVideosFromSubscribedChannels,
    enabled: isAuthenticated,
    retry: false
  });

  // Fallback to all videos if no subscriptions or error
  const { data: fallbackVideosData, isLoading: loadingFallback } = useGetAllVideos(12);

  const subVideos = subVideosData?.data || [];
  const allFallbackVideos = fallbackVideosData?.pages?.flatMap(page => page?.data?.videos || page?.data || []) || [];
  const fallbackVideos = Array.from(new Map(allFallbackVideos.map(v => [v._id, v])).values());

  const displayVideos = subVideos.length > 0 ? subVideos : fallbackVideos;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-bg-main text-text-main p-6">
        <div className="bg-surface-card border border-border-main p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
          <Bell className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Don't miss new videos</h2>
          <p className="text-text-sub text-sm mb-6">Sign in to see updates from your favorite creators and subscribed channels.</p>
          <button 
            onClick={() => navigate("/login")} 
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-lg hover:scale-[1.02] transition cursor-pointer text-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const isLoading = loadingSub || (subVideos.length === 0 && loadingFallback);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-4 md:p-6 text-left transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-text-main flex items-center gap-2 tracking-tight">
          <TvMinimalPlay className="h-7 w-7 text-primary" />
          Subscriptions
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : displayVideos.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border-main">
            <p className="text-text-sub text-lg">No subscription videos found.</p>
            <p className="text-text-muted text-sm mt-1">Start subscribing to creators to build your subscription feed.</p>
          </div>
        ) : (
          <div>
            {subVideos.length === 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-primary">
                💡 Showing recommended videos feed (subscribe to creators to populate your personal subscriptions page).
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  channel={video.owner?.fullName || video.owner?.username || "Channel"}
                  views={video.views}
                  uploadedAt={new Date(video.createdAt).toLocaleDateString()}
                  duration={video.duration}
                  avatar={video.owner?.avatar}
                  onClick={() => navigate(`/watch/${video._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
