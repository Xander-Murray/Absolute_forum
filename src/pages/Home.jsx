import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Recent Posts</h2>
      <PostList />
    </div>
  );
};
