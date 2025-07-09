import { Link } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function Header() {
  const { user, clearUser } = useUserStore();
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          My Community
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/products">상품</Link>
          </li>
          <li>
            <Link to="/posts">게시판</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link to="/profile">내 정보</Link>
              </li>
              <li>
                <button
                  onClick={clearUser}
                  className="text-blue-500 hover:text-blue-700"
                >
                  로그아웃
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
