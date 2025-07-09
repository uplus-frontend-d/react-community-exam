import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../libs/supabase";

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState({
    title: "",
    author: "",
    content: "",
    created_at: "",
  });
  // 나머지 임시 게시글 데이터
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("title, author, content, created_at")
        .eq("id", id)
        .single();
      if (data) setPost(data);
    }
    fetchPost();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // 실제로는 댓글 저장 로직이 들어가야 함
    alert("댓글: " + comment);
    setComment("");
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-12">
      <div className="w-full max-w-3xl bg-base-100 shadow-xl rounded-xl p-10">
        <h2 className="text-3xl font-bold mb-4">
          {post.title || "(제목 없음)"}
        </h2>
        <div className="flex justify-between text-base text-gray-500 mb-6">
          <span>작성자: {post.author}</span>
          <span>{post.created_at}</span>
        </div>
        <div className="text-lg whitespace-pre-line mb-10">{post.content}</div>
        <div className="flex justify-end mb-4">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            뒤로가기
          </button>
        </div>
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-8">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="댓글을 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit">
            댓글 작성
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostDetailPage;
