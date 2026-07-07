import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getAllVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import { Flame, Compass, Play, Sparkles } from "lucide-react";

const CATEGORIES = [
  { name: "trending", label: "Trending" },
  { name: "music", label: "Music" },
  { name: "gaming", label: "Gaming" },
  { name: "sports", label: "Sports" },
  { name: "courses", label: "Courses" },
  { name: "podcasts", label: "Podcasts" },
  { name: "news", label: "News" },
  { name: "shopping", label: "Shopping" },
  { name: "movies", label: "Movies" },
  { name: "fashion", label: "Fashion" },
  { name: "others", label: "Others" }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("trending");
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  // Fetch videos for active category
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["videos_feed", activeCategory],
    queryFn: ({ pageParam = null }) => 
      getAllVideos(`category=${activeCategory}&limit=12${pageParam ? `&cursor=${pageParam}` : ""}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor || null,
    initialPageParam: null,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allVideos = data?.pages?.flatMap(page => page?.data?.videos || page?.data || []) || [];
  const videos = Array.from(new Map(allVideos.map(v => [v._id, v])).values());

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-4 md:p-6 text-left transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-purple-950/80 p-6 md:p-10 border border-border-main shadow-2xl">
          <div className="absolute top-20 left-0 w-80 h-80 bg-white/5 rotate-45 rounded-3xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-black/10 rotate-45 rounded-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30 mb-4 uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Introducing Clipster
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none mb-3">
              Your next video adventure starts here
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-light mb-6">
              Explore thousands of creators sharing tutorials, music, movies, gaming walkthroughs, and news. Publish your own today!
            </p>
          </div>
        </div>

        {/* Categories Carousel / List */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                activeCategory === cat.name
                  ? "bg-text-main text-bg-main border-text-main shadow-md scale-105"
                  : "bg-surface hover:bg-surface-hover text-text-sub border-border-main"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Video Grid Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-surface border border-border-main rounded-2xl">
            <p className="text-danger font-semibold">Failed to load videos.</p>
            <p className="text-text-muted text-xs mt-1">Check your server connection and try again.</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-border-main rounded-2xl">
            <Compass className="h-10 w-10 text-text-muted mx-auto mb-2" />
            <p className="text-text-secondary text-base">No videos found in this category.</p>
            <p className="text-text-muted text-xs mt-1">Be the first to upload a video in this category!</p>
          </div>
        ) : (
          <div>
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

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="h-16 flex items-center justify-center mt-6">
              {isFetchingNextPage && (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}