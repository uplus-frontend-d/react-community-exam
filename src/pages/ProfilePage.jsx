import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { useForm } from "react-hook-form";
import { supabase } from "../libs/supabase";

function ProfilePage() {
  const { user, updateUser } = useUserStore();

  // useForm 훅으로 폼 상태 및 함수 가져오기
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nickname: user?.nickname || "", // 초기 닉네임 값 설정
    },
  });

  // 폼 제출 시 실행될 함수 정의 (유효성 검사 통과 후)
  const onSubmit = async (data) => {
    const { nickname } = data;

    try {
      const { error } = await supabase
        .from("users")
        .update({ nickname })
        .eq("id", user.id);

      if (error) {
        console.error("닉네임 업데이트 실패:", error.message);
        alert("닉네임 변경 실패");
      } else {
        // ✅ DB에 저장된 새로운 user 정보 다시 조회
        const { data: updatedUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (fetchError) {
          console.error(
            "업데이트된 사용자 정보 가져오기 실패:",
            fetchError.message
          );
        } else {
          updateUser(updatedUser); // ✅ Zustand 스토어에 반영
        }

        alert("닉네임 변경 성공");
      }
    } catch (err) {
      console.error("예외 발생:", err);
      alert("알 수 없는 오류 발생");
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto p-8 flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-bold">내 정보</h1>
      <div className="w-full flex justify-end">
        <p className="mb-2">
          <span className="font-semibold">ID:</span> {user.id}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Joined at:</span>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </p>
        {/* {user.user_metadata?.full_name && (
          <p className="mb-2">
            <span className="font-semibold">Name:</span>{" "}
            {user.user_metadata.full_name}
          </p>
        )} */}
        <button
          className="btn btn-error"
          onClick={() => {
            useUserStore.getState().clearUser();
          }}
        >
          로그아웃
        </button>
      </div>
      <div className="bg-base-100 shadow p-6 rounded w-full max-w-md ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">이메일</span>
            </label>
            <input
              id="email"
              readOnly
              value={user.email}
              type="text"
              className="input input-bordered w-full pointer-events-none select-none bg-gray-100"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="nickname">
              <span className="label-text">닉네임</span>
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              className="input input-bordered w-full"
              {...register("nickname")}
            />
            {errors.nickname && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nickname.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
