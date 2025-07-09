import { supabase } from "../libs/supabase";

export const fetchPosts = async (page = 1, limit = 10) => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase 환경 변수를 설정해주세요. (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)"
    );
  }

  const offset = (page - 1) * limit;

  // 전체 개수를 가져오는 쿼리
  const { count: totalCount, error: countError } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  // 페이지 데이터를 가져오는 쿼리
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id, title, content, created_at
    `
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    posts: data ?? [],
    totalCount: totalCount ?? 0,
  };
};
