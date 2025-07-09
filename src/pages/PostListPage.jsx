import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { fetchPosts } from "../apis/postApi";
import { useUserStore } from "../stores/userStore";

function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUserStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { posts: fetchedPosts, totalCount } = await fetchPosts(
          currentPage,
          itemsPerPage
        );

        const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
        setTotalPages(calculatedTotalPages);
        setPosts(fetchedPosts);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages && totalPages > 0) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">에러: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">자유 게시판</h1>
        <p className="text-gray-500">다양한 이야기를 나눠보세요.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>본문</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="hover">
                <th>{post.id}</th>
                <td>
                  <a href="#" className="link link-hover">
                    {post.title}
                  </a>
                </td>
                <td>{post.content}</td>
                <td>{post.created_at.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        {user && (
          <Link to="/write" className="btn btn-primary">
            글쓰기
          </Link>
        )}
      </div>
    </div>
  );
}

export default PostListPage;
