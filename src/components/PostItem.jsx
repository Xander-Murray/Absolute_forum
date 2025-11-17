import { Link } from "react-router-dom";

export const PostItem = ({ post, showContent, showImage }) => {
  const previewContent = post.content
    ? post.content.length > 160
      ? post.content.slice(0, 160) + "..."
      : post.content
    : "";

  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2 mb-3">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-1">
                {post.title}
              </div>
              {post.like_count != null && (
                <span className="text-xs text-gray-400">
                  {post.like_count} upvote
                  {post.like_count === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>

          {/* Optional content preview */}
          {showContent && previewContent && (
            <p className="text-sm text-gray-300 mb-3">{previewContent}</p>
          )}

          {/* Optional image */}
          {showImage && post.image_url && (
            <div className="mt-1">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full rounded-[20px] object-cover max-h-[150px] mx-auto"
              />
            </div>
          )}

          <div className="flex justify-around items-center mt-3">
            <span className="cursor-pointer h-10 w-[60px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤️ <span className="ml-2">{post.like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-10 w-[60px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 <span className="ml-2">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
