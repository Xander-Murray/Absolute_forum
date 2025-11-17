import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createReply = async (
  replyContent,
  postId,
  parentCommentId,
  userId,
  author,
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        {user && (
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="text-blue-500 text-sm mt-1"
          >
            {showReply ? "Cancel" : "Reply"}
          </button>
        )}
      </div>

      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            placeholder="Write a reply..."
            rows={2}
          />
          <button
            type="submit"
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && <p className="text-red-500">Error posting reply.</p>}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? "Show Replies" : "Hide Replies"}
            className="text-xs text-gray-400 flex items-center gap-1 mb-1"
          >
            {isCollapsed ? "Show replies" : "Hide replies"}
          </button>

          {!isCollapsed && (
            <div className="space-y-2">
              {comment.children.map((child) => (
                <CommentItem key={child.id} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
