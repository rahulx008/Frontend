import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUserWatchHistory, clearWatchHistory } from "../api/userApi";
import { useAuth } from "../context/authContext";
import VideoCard from "../components/VideoCard";
import { History as HistoryIcon, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function History() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch watch history
  const { data: historyData, isLoading } = useQuery({
    queryKey: ["watch_history"],
    queryFn: () => getUserWatchHistory(100, 1),
    enabled: isAuthenticated,
  });

  const videos = historyData?.data || [];

  // Clear watch history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: clearWatchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["watch_history"]);
      toast.success("Watch history cleared");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to clear watch history");
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-bg-main text-text-main p-6 text-center transition-colors duration-200">
        <div className="bg-surface-card border border-border-main p-8 rounded-2xl max-w-md w-full shadow-xl">
          <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Keep track of what you watch</h2>
          <p className="text-text-sub text-sm mb-6 font-light">Watch history isn't viewable when you're signed out. Sign in to view yours.</p>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-2 tracking-tight">
            <HistoryIcon className="h-7 w-7 text-primary" />
            Watch History
          </h1>

          {videos.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your entire watch history?")) {
                  clearHistoryMutation.mutate();
                }
              }}
              disabled={clearHistoryMutation.isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Clear All History
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border-main">
            <Clock className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-sub text-lg">Your watch history is empty.</p>
            <p className="text-text-muted text-sm mt-1">Videos you watch will be listed here.</p>
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
