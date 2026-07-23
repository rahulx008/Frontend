import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useFetchVideos } from "../queries/videoQueries.js";
import VideoCard from "./VideoCard";

export default function VideoGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const { 
    data: videos = [], 
    isLoading: loadingResults, 
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage 
  } = useFetchVideos(searchParams);

  useEffect(() => {
    if (isError) {
      console.error("Search query failed:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allVideos = videos?.pages?.flatMap(page => page.data.videos || []) || [];
  const resultVideos = Array.from(new Map(allVideos.map(v => [v._id, v])).values());
  const resultChannels = videos?.pages?.[0]?.data?.channels || [];

  return (
    <section className="video-grid-section">
      {/* Channels section */}
      {resultChannels.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-text-main mb-4 tracking-tight border-b border-border-main pb-2 text-left">
            Channels
          </h2>
          <div className="flex flex-col gap-4">
            {resultChannels.map((chan) => (
              <div 
                key={chan._id} 
                onClick={() => navigate(`/channel/${chan.username}`)}
                className="flex items-center gap-6 bg-surface hover:bg-surface-hover p-4 rounded-xl border border-border-main cursor-pointer transition duration-150 max-w-2xl"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border border-border-main bg-bg-main flex-shrink-0 flex items-center justify-center font-bold uppercase text-2xl text-text-main">
                  {chan.avatar ? (
                    <img src={chan.avatar} alt={chan.username} className="w-full h-full object-cover" />
                  ) : (
                    chan.username?.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-bold text-base sm:text-lg text-text-main truncate">
                    {chan.fullName || chan.username}
                  </h4>
                  <p className="text-sm text-text-sub">@{chan.username}</p>
                  <p className="text-xs text-text-muted mt-1 font-medium">{chan.subscribersCount || 0} subscribers</p>
                </div>
                <button className="px-5 py-1.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary-hover transition cursor-pointer flex-shrink-0">
                  View Channel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div>
        {resultChannels.length > 0 && resultVideos.length > 0 && (
          <h2 className="text-lg font-bold text-text-main mb-4 tracking-tight border-b border-border-main pb-2 text-left">
            Videos
          </h2>
        )}
        {loadingResults ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border-main">
            <p className="text-danger font-semibold text-lg">Failed to load search results.</p>
            <p className="text-text-muted text-sm mt-1">{error?.response?.data?.message || error?.message || "Check your server connection and try again."}</p>
          </div>
        ) : resultVideos.length === 0 && resultChannels.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border-main">
            <p className="text-text-sub text-lg">No search results found.</p>
            <p className="text-text-muted text-sm mt-1">Try a different search query or check spelling.</p>
          </div>
        ) : (
          <div className="video-grid">
            {resultVideos.map((video) => (
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

      {/* Infinite Scroll Trigger */}
      {resultVideos.length > 0 && (
        <div ref={ref} className="h-16 flex items-center justify-center mt-6">
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          )}
        </div>
      )}

      <style>{`
        .video-grid-section {
          width: 100%;
          padding: 24px;
          background: var(--background);
          min-height: 100vh;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(320px, 1fr)
          );
          gap: 28px 18px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .video-grid-section {
            padding: 16px;
          }

          .video-grid {
            grid-template-columns: repeat(
              auto-fill,
              minmax(280px, 1fr)
            );
            gap: 22px 14px;
          }
        }

        @media (max-width: 480px) {
          .video-grid-section {
            padding: 12px;
          }

          .video-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }
      `}</style>
    </section>
  );
}