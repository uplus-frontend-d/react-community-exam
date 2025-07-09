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
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
