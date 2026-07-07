import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetLikedVideos } from "../queries/likeQueries";
import { useAuth } from "../context/authContext";
import VideoCard from "../components/VideoCard";
import { ThumbsUp, Heart } from "lucide-react";

export default function LikedVideos() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch liked videos
  const { data: likedData, isLoading } = useGetLikedVideos(isAuthenticated);

  const videos = likedData?.data || [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-bg-main text-text-main p-6 text-center transition-colors duration-200">
        <div className="bg-surface-card border border-border-main p-8 rounded-2xl max-w-md w-full shadow-xl">
          <ThumbsUp className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">See your liked videos</h2>
          <p className="text-text-sub text-sm mb-6 font-light">Videos you like will be saved here so you can watch them again. Sign in to view yours.</p>
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
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-text-main flex items-center gap-2 tracking-tight">
          <ThumbsUp className="h-7 w-7 text-primary" />
          Liked Videos
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border-main">
            <Heart className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-sub text-lg">No liked videos yet</p>
            <p className="text-text-muted text-sm mt-1">Tap the thumbs up button on any video to add it to your likes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
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
        )}
      </div>
    </div>
  );
}
