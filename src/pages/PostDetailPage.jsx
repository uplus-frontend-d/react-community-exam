import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../libs/supabase";

function PostDetailPage() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({
    title: "",
    author: "",
    content: "",
    created_at: "",
  });
  // 나머지 임시 게시글 데이터
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  async function fetchPost() {
    const { data, error } = await supabase
      .from("posts")
      .select("title, author, content, created_at")
      .eq("id", Number(id))
      .single();
    if (data) setPost(data);
  }
  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", Number(id))
      .order("created_at", { ascending: false });
    if (data) setComments(data);
  }
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // 실제로는 댓글 저장 로직이 들어가야 함
    const { data, error } = await supabase.from("comments").insert({
      post_id: id,
      content: comment,
    });
    if (error) console.error("댓글 저장 중 오류 발생:", error);
    setComment("");
    await fetchComments();
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
        <div className="mt-8">
          {comments.map((comment) => (
            <div key={comment.id}>{comment.content}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
