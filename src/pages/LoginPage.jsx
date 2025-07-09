import { useState } from "react";
import { supabase } from "../libs/supabase";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("로그인 실패", error);
      return;
    }

    // ✅ 사용자 정보 테이블에서 닉네임 조회
    /*
    🧠 왜 그런가?
      Supabase는 사용자 계정 정보를 두 가지로 나눠서 관리합니다:

      1. auth.users (내장 사용자 테이블)
      이메일, ID, 생성일, 이메일 인증 여부 등의 기본 필드만 존재

      nickname, profile_image 등의 커스텀 필드는 없음

      2. public.users 또는 profiles (사용자가 직접 만든 유저 정보 테이블)
      사용자 커스텀 필드 (예: nickname, bio, avatar_url 등) 보관

      auth.users.id와 FK 관계 (보통 user_id)로 연결
    */
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("nickname")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("유저 정보 조회 실패:", profileError.message);
    } else {
      console.log("닉네임:", profile.nickname);
    }

    useUserStore
      .getState()
      .setUser({ ...data.user, nickname: profile.nickname });
    navigate("/profile");
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("구글 로그인 실패", error);
      return;
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">이메일</span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">비밀번호</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{"로그인 실패"}</p>
          )}
          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner" />
              ) : (
                "로그인"
              )}
            </button>
          </div>
          <div className="divider">또는</div>
          <div className="form-control">
            <button
              type="button"
              className="btn btn-outline w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              구글로 로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
