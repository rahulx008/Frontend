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
  return (
    <div className="yt-card" onClick={onClick}>
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

      <style jsx>{`
        .yt-card {
          width: 100%;
          cursor: pointer;
          font-family: Arial, sans-serif;
        }

        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          background: #f1f1f1;
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
          background: rgba(0, 0, 0, 0.85);
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding: 3px 5px;
          border-radius: 4px;
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
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .info {
          flex: 1;
          min-width: 0;
        }

        .title {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .channel-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
        }

        .channel {
          font-size: 14px;
          color: #cbd5e1; /* light gray for dark background */
        }

        .verified {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #64748b;
          color: white;
          font-size: 10px;
        }

        .meta {
          margin: 2px 0 0;
          font-size: 14px;
          color: #94a3b8;
        }

        .menu-btn {
          border: none;
          background: transparent;
          color: #606060;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          height: fit-content;
        }

        .menu-btn:hover {
          color: #000;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 15px;
          }

          .channel,
          .meta {
            font-size: 13px;
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