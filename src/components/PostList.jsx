import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { useUiSettings } from "../context/UiSettingsContext.jsx";

export const PostList = () => {
  const { settings } = useUiSettings();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | upvotes-desc | upvotes-asc

  const fetchPosts = async () => {
    const { data, error } = await supabase.rpc("get_posts_with_counts");

    if (error) throw new Error(error.message);

    return data ?? [];
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  let posts = data || [];

  const term = search.toLowerCase();
  posts = posts.filter((post) =>
    (post.title || "").toLowerCase().includes(term),
  );

  posts = [...posts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    }

    const likeA = a.like_count || 0;
    const likeB = b.like_count || 0;

    if (sortBy === "upvotes-desc") {
      return likeB - likeA;
    }
    if (sortBy === "upvotes-asc") {
      return likeA - likeB;
    }

    return 0;
  });

  if (!posts.length) {
    return <div className="text-gray-400">No posts yet.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Controls: search + sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search posts by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-white/10 bg-transparent p-2 rounded text-sm"
        />

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-300">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm"
          >
            <option value="newest">Newest (creation time)</option>
            <option value="oldest">Oldest (creation time)</option>
            <option value="upvotes-desc">Most upvotes</option>
            <option value="upvotes-asc">Fewest upvotes</option>
          </select>
        </div>
      </div>

      {/* Post cards */}
      <div className="flex flex-wrap gap-6 justify-center">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            showContent={settings.showContent}
            showImage={settings.showImage}
          />
        ))}
      </div>
    </div>
  );
};
