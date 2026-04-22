"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState, useEffect } from "react";
import PostAuthor from "./PostAuthor";

interface PostDetailProps {
  postId: number;
}

async function getPostDetail(postId: number) {
  const location = typeof window === "undefined" ? "🟦 SERVER" : "🟨 CLIENT";
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: postId,
    title: "포스트 상세 정보",
    body: "이것은 포스트의 상세 내용입니다.",
    userId: 1,
  };
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [hydrated, setHydrated] = useState(false);
  const isServer = typeof window === "undefined";

  useEffect(() => {
    console.log("🟨 [CLIENT] PostDetail Hydration 완료");
    setHydrated(true);
  }, []);

  const location = isServer ? "🟦 SERVER" : "🟨 CLIENT";
  const stepTime = Date.now();
  
  console.log(`\n${location} 2️⃣ [PostDetail] 렌더링 시작 (postId: ${postId})`);
  console.log(`${location}    현재 시각: ${new Date(stepTime).toISOString()}`);

  // 두 번째 요청: Post 상세 정보
  // ⚠️ WaterfallClientWrapper가 렌더링된 후에야 이 요청이 시작됩니다!
  const { data } = useSuspenseQuery({
    queryKey: ["post-detail", postId],
    queryFn: async () => {
      const fetchLocation = typeof window === "undefined" ? "🟦 SERVER" : "🟨 CLIENT";
      const fetchStartTime = Date.now();
      
      console.log(`${fetchLocation}    🚀 2️⃣ getPostDetail(${postId}) 시작...`);
      const result = await getPostDetail(postId);
      
      const fetchDuration = Date.now() - fetchStartTime;
      console.log(`${fetchLocation}    ✅ 2️⃣ getPostDetail(${postId}) 완료 (${fetchDuration}ms)\n`);
      
      return result;
    },
  });

  const totalDuration = Date.now() - stepTime;
  console.log(`${location} ✅ 2️⃣ [PostDetail] 데이터 로드 완료 (${totalDuration}ms)`);
  console.log(`${location}    다음 단계: PostAuthor 렌더링 시작...\n`);

  return (
    <div
      style={{
        padding: "15px",
        background: hydrated ? "#fff3e0" : "#fff9c4",
        borderRadius: "4px",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          padding: "15px",
          background: "white",
          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <h3>2️⃣ Post Detail (ID: {postId})</h3>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          렌더링 위치: <strong>{isServer ? "🟦 SERVER" : hydrated ? "🟨 CLIENT (Hydrated)" : "🟡 CLIENT (Hydrating...)"}</strong>
        </div>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
          {data.body}
        </p>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}>
          작성자 ID: <strong>{data.userId}</strong>
        </p>
        <p style={{ color: "#999", fontSize: "12px", marginTop: "5px" }}>
          이제 이 ID로 PostAuthor를 렌더링합니다...
        </p>
      </div>

      <Suspense
        fallback={
          <div
            style={{
              padding: "10px",
              background: "#ffebee",
              borderRadius: "4px",
            }}
          >
            <p>⏳ 3단계: Author 정보 로딩 중...</p>
            <p style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
              ⚠️ 2단계가 완료되어야 3단계가 시작됩니다!
            </p>
          </div>
        }
      >
        <PostAuthor userId={data.userId} />
      </Suspense>
    </div>
  );
}
