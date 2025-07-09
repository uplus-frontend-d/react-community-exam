import { supabase } from "../libs/supabase";
import { useUserStore } from "../stores/userStore";

export const writePost = async ({ title, content }) => {
  if (!title || !content) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  // 현재 로그인한 사용자 정보 가져오기
  const user = useUserStore.getState().user;

  if (!user || !user.id) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        content,
        created_at: new Date().toISOString(),
        user_id: user.id,
      },
    ])
    .select();

  if (error) {
    throw new Error(`게시글 작성에 실패했습니다: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("게시글이 생성되지 않았습니다.");
  }

  return data[0];
};
