import { useParams } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
  const { id } = useParams();
  const postId = id ? Number(id) : null;

  return (
    <div className="pt-20">
      {postId ? <PostDetail postId={postId} /> : <div>Invalid post id.</div>}
    </div>
  );
};
