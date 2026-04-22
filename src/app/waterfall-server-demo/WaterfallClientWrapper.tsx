"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/posts";
import { Suspense, useState, useEffect } from "react";
import PostDetail from "./PostDetail";

let renderCount = 0;

export default function WaterfallClientWrapper() {
  const [hydrated, setHydrated] = useState(false);
  const isServer = typeof window === "undefined";
  
  renderCount++;
  const currentRenderCount = renderCount;

  useEffect(() => {
    console.log("🟨 [CLIENT] WaterfallClientWrapper Hydration 완료");
    setHydrated(true);
  }, []);

  const location = isServer ? "🟦 SERVER" : "🟨 CLIENT";
  const stepTime = Date.now();
  
  console.log(`\n${location} 1️⃣ [WaterfallClientWrapper] 렌더링 시작 (render #${currentRenderCount})`);
  console.log(`${location}    현재 시각: ${new Date(stepTime).toISOString()}`);

  // 첫 번째 요청: Posts 리스트
  const { data } = useSuspenseQuery({
    queryKey: ["posts-waterfall-v2"],
    queryFn: async () => {
      const fetchLocation = typeof window === "undefined" ? "🟦 SERVER" : "🟨 CLIENT";
      const fetchStartTime = Date.now();
      
      console.log(`${fetchLocation}    🚀 1️⃣ getPosts() 시작...`);
      const result = await getPosts();
      
      const fetchDuration = Date.now() - fetchStartTime;
      console.log(`${fetchLocation}    ✅ 1️⃣ getPosts() 완료 (${fetchDuration}ms)\n`);
      
      return result;
    },
  });

  const totalDuration = Date.now() - stepTime;
  console.log(`${location} ✅ 1️⃣ [WaterfallClientWrapper] 데이터 로드 완료 (${totalDuration}ms)`);
  console.log(`${location}    다음 단계: PostDetail 렌더링 시작...\n`);

  const firstPostId = data?.posts?.[0]?.id;

  return (
    <div
      style={{
        padding: "20px",
        background: hydrated ? "#e3f2fd" : "#fff9c4",
        borderRadius: "8px",
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
        <h3>1️⃣ Posts 리스트</h3>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          렌더링 위치: <strong>{isServer ? "🟦 SERVER" : hydrated ? "🟨 CLIENT (Hydrated)" : "🟡 CLIENT (Hydrating...)"}</strong>
        </div>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
          첫 번째 포스트 ID: <strong>{firstPostId}</strong>
        </p>
        <p style={{ color: "#999", fontSize: "12px", marginTop: "5px" }}>
          이제 이 ID로 PostDetail을 렌더링합니다...
        </p>
      </div>

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
              <p style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
                ⚠️ 1단계가 완료되어야 2단계가 시작됩니다!
              </p>
            </div>
          }
        >
          <PostDetail postId={firstPostId} />
        </Suspense>
      )}
    </div>
  );
}
