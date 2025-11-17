import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { useAuth } from "../context/AuthContext";

// --- Fetch one post by id ---
const fetchPostById = async (id) => {
  console.log("[PostDetail] fetchPostById:", id);
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[PostDetail] fetchPostById error:", error);
    throw new Error(error.message);
  }

  console.log("[PostDetail] fetched post:", data);
  return data;
};

export const PostDetail = ({ postId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: post,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (post) {
      setEditTitle(post.title || "");
      setEditContent(post.content || "");
    }
  }, [post]);

  const isOwner =
    !!user && !!post && (!post.user_id || user.id === post.user_id);

  // --- UPDATE mutation ---
  const updateMutation = useMutation({
    mutationFn: async ({ title, content }) => {
      console.log("[PostDetail] update post", postId, { title, content });
      const { data, error } = await supabase
        .from("posts")
        .update({ title, content })
        .eq("id", postId)
        .select(); // return rows to verify something changed

      if (error) {
        console.error("[PostDetail] update error:", error);
        throw new Error(error.message);
      }

      // If no rows were affected, surface it
      if (!data || data.length === 0) {
        console.error("[PostDetail] update affected 0 rows");
        throw new Error("Post not found or you do not have permission.");
      }

      console.log("[PostDetail] update success, rows:", data);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsEditing(false);
    },
  });

  // --- DELETE mutation ---
  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log("[PostDetail] delete post", postId);
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .select(); // get deleted rows

      if (error) {
        console.error("[PostDetail] delete error:", error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        console.error("[PostDetail] delete affected 0 rows");
        throw new Error("Post not found or you do not have permission.");
      }

      console.log("[PostDetail] delete success, rows:", data);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      window.location.href = "/";
    },
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!isOwner) return;
    updateMutation.mutate({
      title: editTitle,
      content: editContent,
    });
  };

  if (!postId) return <div>Invalid post id.</div>;
  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found.</div>;

  const createdDate = new Date(post.created_at).toLocaleString();

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {post.title}
      </h2>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="mt-4 rounded object-cover w-full max-h-[400px]"
        />
      )}

      <p className="text-gray-500 text-sm text-center">
        Posted on: {createdDate}
      </p>

      {/* EDIT FORM OR CONTENT */}
      {isOwner && isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-3 mt-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-white/10 bg-transparent p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Content</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-white/10 bg-transparent p-2 rounded"
              rows={6}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-purple-500 px-4 py-2 rounded text-sm disabled:opacity-60"
            >
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
          </div>
          {updateMutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              Error updating post: {updateMutation.error?.message}
            </p>
          )}
        </form>
      ) : (
        <>
          <p className="text-gray-200 whitespace-pre-wrap mt-4">
            {post.content}
          </p>

          {isOwner && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 px-4 py-2 rounded text-sm"
              >
                Edit post
              </button>
              <button
                onClick={() => {
                  const ok = window.confirm(
                    "Are you sure you want to delete this post?",
                  );
                  if (ok) deleteMutation.mutate();
                }}
                className="bg-red-600 px-4 py-2 rounded text-sm"
              >
                Delete post
              </button>
            </div>
          )}
        </>
      )}

      {deleteMutation.isError && (
        <p className="text-red-500 text-sm mt-2">
          Error deleting post: {deleteMutation.error?.message}
        </p>
      )}

      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};
