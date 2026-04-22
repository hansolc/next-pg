"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/posts";

export default function PostsList() {
  console.log("📌 [PostsList] 컴포넌트 렌더링 시작");
  
  // ✨ prefetchQuery 없이 useSuspenseQuery만 사용!
  // ReactQueryStreamedHydration이 서버에서 자동으로 fetch합니다
  const { data } = useSuspenseQuery({
    queryKey: ["posts-experimental"],
    queryFn: getPosts,
  });

  console.log("✅ [PostsList] 데이터 로드 완료:", data?.posts?.length, "개");

  return (
    <div
      style={{
        padding: "20px",
        background: "#e3f2fd",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h2>📝 Posts ({data?.posts?.length || 0}개)</h2>
      <div style={{ marginTop: "10px" }}>
        {data?.posts?.slice(0, 3).map((post: any) => (
          <div
            key={post.id}
            style={{
              padding: "10px",
              background: "white",
              marginBottom: "8px",
              borderRadius: "4px",
            }}
          >
            <strong>{post.title}</strong>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}>
              {post.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
