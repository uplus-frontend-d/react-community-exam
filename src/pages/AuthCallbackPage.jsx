import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabase";
import { useUserStore } from "../stores/userStore";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("인증 콜백 처리 중 오류:", error);
        navigate("/login");
        return;
      }

      if (data.session) {
        setUser(data.session.user);
        navigate("/");
      } else {
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body text-center">
          <h2 className="text-2xl font-bold mb-4">로그인 처리 중...</h2>
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthCallbackPage;
