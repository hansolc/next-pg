"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import PostAuthor from "./PostAuthor";

interface PostDetailProps {
  postId: number;
}

// 가상의 API 함수 (실제로는 services에 있어야 함)
async function getPostDetail(postId: number) {
  console.log(`  🚀 getPostDetail(${postId}) 시작`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: postId,
    title: "포스트 상세 정보",
    body: "이것은 포스트의 상세 내용입니다.",
    userId: 1,
  };
}

export default function PostDetail({ postId }: PostDetailProps) {
  const startTime = Date.now();
  console.log("🌊 2️⃣ [PostDetail] 컴포넌트 렌더링 시작");

  // 두 번째 요청: Post 상세 정보
  // ⚠️ PostsList가 렌더링된 후에야 이 요청이 시작됩니다!
  const { data } = useSuspenseQuery({
    queryKey: ["post-detail", postId],
    queryFn: async () => {
      const result = await getPostDetail(postId);
      console.log(
        `  ✅ getPostDetail(${postId}) 완료 (${Date.now() - startTime}ms)`
      );
      return result;
    },
  });

  console.log(`✅ 2️⃣ [PostDetail] 데이터 로드 완료, 작성자 ID: ${data.userId}`);

  return (
    <div
      style={{
        padding: "15px",
        background: "#fff3e0",
        borderRadius: "4px",
        marginTop: "10px",
      }}
    >
      <h3>📄 Post Detail (ID: {postId})</h3>
      <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
        {data.body}
      </p>
      <p style={{ color: "#999", fontSize: "12px", marginTop: "10px" }}>
        작성자 정보를 불러옵니다...
      </p>

      <Suspense
        fallback={
          <div
            style={{
              padding: "10px",
              background: "#ffebee",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            <p>⏳ 3단계: Author 정보 로딩 중...</p>
          </div>
        }
      >
        <PostAuthor userId={data.userId} />
      </Suspense>
    </div>
  );
}
