"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/posts";
import { Suspense } from "react";
import PostDetail from "./PostDetail";

export default function PostsList() {
  const startTime = Date.now();
  console.log("🌊 1️⃣ [PostsList] 컴포넌트 렌더링 시작");

  // 첫 번째 요청: Posts 리스트
  const { data } = useSuspenseQuery({
    queryKey: ["posts-waterfall"],
    queryFn: async () => {
      console.log("  🚀 getPosts() 시작");
      const result = await getPosts();
      console.log(`  ✅ getPosts() 완료 (${Date.now() - startTime}ms)`);
      return result;
    },
  });

  const firstPostId = data?.posts?.[0]?.id;
  console.log(
    `✅ 1️⃣ [PostsList] 데이터 로드 완료, 첫 번째 포스트 ID: ${firstPostId}`
  );

  return (
    <div
      style={{
        padding: "20px",
        background: "#e3f2fd",
        borderRadius: "8px",
      }}
    >
      <h2>📝 Posts 리스트</h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>
        첫 번째 포스트의 상세 정보를 불러옵니다...
      </p>

      {firstPostId && (
        <Suspense
          fallback={
            <div
              style={{
                padding: "15px",
                background: "#fff3e0",
                borderRadius: "4px",
              }}
            >
              <p>⏳ 2단계: Post Detail 로딩 중...</p>
            </div>
          }
        >
          <PostDetail postId={firstPostId} />
        </Suspense>
      )}
    </div>
  );
}
