export default function VideoCard({
  thumbnail,
  title,
  channel,
  views,
  uploadedAt,
  duration,
  avatar,
  verified = false,
  onClick,
}) {
  //this is click function that will be called when the video card is clicked.It can be used to navigate to the video detail page or perform any other action related to the video.
  const handleClick = () => {
    console.log("VideoCard clicked:", title);
    if (onClick) onClick();
  }

  return (
    <div className="yt-card" onClick={handleClick}>
      {/* Thumbnail */}
      <div className="thumbnail-wrapper">
        <img
          src={thumbnail}
          alt={title}
          className="thumbnail"
        />

        <span className="duration">{duration}</span>
      </div>

      {/* Content */}
      <div className="content">
        <img
          src={avatar}
          alt={channel}
          className="avatar"
        />

        <div className="info">
          <h3 className="title">{title}</h3>

          <div className="channel-row">
            <span className="channel">{channel}</span>

            {verified && (
              <span className="verified">
                ✓
              </span>
            )}
          </div>

          <p className="meta">
            {views} views • {uploadedAt}
          </p>
        </div>

        <button className="menu-btn">
          ⋮
        </button>
      </div>

      <style>{`
        .yt-card {
          width: 100%;
          cursor: pointer;
          font-family: var(--sans);
          transition: transform 0.2s ease-in-out;
        }

        .yt-card:hover {
          transform: translateY(-2px);
        }

        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--border-color);
        }

        .thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 6px;
          border-radius: var(--radius-sm);
          line-height: 1;
        }

        .content {
          display: flex;
          gap: 12px;
          padding-top: 12px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }

        .info {
          flex: 1;
          min-width: 0;
        }

        .title {
          margin: 0;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.15s ease;
        }

        .yt-card:hover .title {
          color: var(--primary);
        }

        .channel-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }

        .channel {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .verified {
          width: 13px;
          height: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: #ffffff;
          font-size: 9px;
        }

        .meta {
          margin: 2px 0 0;
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .menu-btn {
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          height: fit-content;
          transition: color 0.15s ease;
        }

        .menu-btn:hover {
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .title {
            font-size: 14px;
          }

          .channel,
          .meta {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .content {
            gap: 10px;
          }

          .avatar {
            width: 34px;
            height: 34px;
          }

          .title {
            font-size: 14px;
          }

          .thumbnail-wrapper {
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
}