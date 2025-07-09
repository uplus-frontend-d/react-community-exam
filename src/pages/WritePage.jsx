import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { writePost } from "../apis/writeApi";
import { useUserStore } from "../stores/userStore";

// 1. Zod로 유효성 검사 스키마 정의
const postSchema = z.object({
  title: z.string().min(3, "제목은 3글자 이상이어야 합니다."),
  // author: z.string().nonempty("작성자 이름을 입력해주세요."),
  content: z.string().min(10, "내용은 10글자 이상이어야 합니다."),
});

function WritePage() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, navigate]);

  // 로그인하지 않은 경우 로딩 화면 표시
  if (!user) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  // 2. useForm 훅으로 폼 상태 및 함수 가져오기
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  // 3. 폼 제출 시 실행될 함수 정의 (유효성 검사 통과 후)
  const onSubmit = async (data) => {
    try {
      // writeApi의 writePost 함수 사용
      await writePost({
        title: data.title,
        content: data.content,
      });

      // 요청이 성공적으로 완료된 후, 목록 페이지로 이동
      navigate("/posts");
    } catch (error) {
      console.error("게시물 작성 중 에러 발생:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">새 게시물 작성</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="title">
            <span className="label-text">제목</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            className="input input-bordered w-full"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="content">
            <span className="label-text">내용</span>
          </label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            className="textarea textarea-bordered h-48 w-full"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">
              {errors.content.message}
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
              제출 중...
            </>
          ) : (
            "제출하기"
          )}
        </button>
      </form>
    </div>
  );
}

export default WritePage;
