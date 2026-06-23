import { useSearchParams } from "react-router-dom";
import { useFetchVideos } from "../queries/videoQueries.js";
import VideoCard from "./VideoCard";

export default function VideoGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");

  // const { data: videos = [] } = useFetchVideos({ query }, {
  //   enabled: true,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  // });

  // console.log("Search query:Grid::", query);
  // console.log("Search params: Grid:: :", searchParams.toString());

  const { data: videos = [], isLoading: loadingResults, hasNextPage } = useFetchVideos(searchParams)

  const resultVideos = videos?.pages?.flatMap(page => page.data.videos) || [];


  return (
    <section className="video-grid-section">
      <div className="video-grid">
        {resultVideos.map((video) => (
          <VideoCard
            key={video._id}
            thumbnail={video.thumbnail}
            title={video.title}
            channel={video.owner.name}
            views={video.views}
            uploadedAt={video.uploadedAt}
            duration={video.duration}
            avatar={video.avatar}
          />
        ))}
      </div>

      <style jsx>{`
        .video-grid-section {
          width: 100%;
          padding: 24px;
          background: #0f0f0f;
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