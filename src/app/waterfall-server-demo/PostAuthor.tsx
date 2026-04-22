"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface PostAuthorProps {
  userId: number;
}

async function getUserInfo(userId: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: userId,
    name: "홍길동",
    email: "hong@example.com",
  };
}

export default function PostAuthor({ userId }: PostAuthorProps) {
  const [hydrated, setHydrated] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState<number | null>(null);
  const isServer = typeof window === "undefined";

  useEffect(() => {
    console.log("🟨 [CLIENT] PostAuthor Hydration 완료");
    setHydrated(true);
  }, []);

  const location = isServer ? "🟦 SERVER" : "🟨 CLIENT";
  const stepTime = Date.now();
  
  console.log(`\n${location} 3️⃣ [PostAuthor] 렌더링 시작 (userId: ${userId})`);
  console.log(`${location}    현재 시각: ${new Date(stepTime).toISOString()}`);

  // 세 번째 요청: 작성자 정보
  // ⚠️ PostDetail이 렌더링된 후에야 이 요청이 시작됩니다!
  // 이것이 바로 Request Waterfall입니다!
  const { data } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const fetchLocation = typeof window === "undefined" ? "🟦 SERVER" : "🟨 CLIENT";
      const fetchStartTime = Date.now();
      
      console.log(`${fetchLocation}    🚀 3️⃣ getUserInfo(${userId}) 시작...`);
      const result = await getUserInfo(userId);
      
      const fetchDuration = Date.now() - fetchStartTime;
      console.log(`${fetchLocation}    ✅ 3️⃣ getUserInfo(${userId}) 완료 (${fetchDuration}ms)\n`);
      
      return result;
    },
  });

  const totalDuration = Date.now() - stepTime;
  
  useEffect(() => {
    const elapsed = Date.now() - stepTime;
    setTotalElapsed(elapsed);
    
    const finalLocation = typeof window === "undefined" ? "🟦 SERVER" : "🟨 CLIENT";
    console.log(`\n🎉 ${finalLocation} ========================================`);
    console.log(`🎉 ${finalLocation} 모든 Waterfall 요청 완료!`);
    console.log(`🎉 ${finalLocation} ========================================`);
    console.log(`🎉 ${finalLocation} 총 소요 시간: 약 4초 (2s + 1s + 1s)`);
    console.log(`🎉 ${finalLocation} 만약 병렬로 실행했다면: 약 2초 (max(2s, 1s, 1s))`);
    console.log(`🎉 ${finalLocation} ========================================\n`);
  }, []);

  console.log(`${location} ✅ 3️⃣ [PostAuthor] 데이터 로드 완료 (${totalDuration}ms)`);
  console.log(`${location}    모든 컴포넌트 렌더링 완료!\n`);

  return (
    <div
      style={{
        padding: "15px",
        background: hydrated ? "#ffebee" : "#fff9c4",
        borderRadius: "4px",
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
        <h3>3️⃣ 작성자 정보</h3>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          렌더링 위치: <strong>{isServer ? "🟦 SERVER" : hydrated ? "🟨 CLIENT (Hydrated)" : "🟡 CLIENT (Hydrating...)"}</strong>
        </div>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
          <strong>이름:</strong> {data.name}
        </p>
        <p style={{ color: "#666", fontSize: "14px" }}>
          <strong>이메일:</strong> {data.email}
        </p>
      </div>

      <div
        style={{
          padding: "15px",
          background: "#fff3e0",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ fontSize: "14px", marginBottom: "10px" }}>
          ⚠️ Waterfall 문제 요약
        </h4>
        <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.8" }}>
          <p><strong>실제 소요 시간:</strong> 약 4초 (순차 실행)</p>
          <p>1️⃣ getPosts(): 2초</p>
          <p>2️⃣ getPostDetail(): 1초 (1번 완료 후 시작)</p>
          <p>3️⃣ getUserInfo(): 1초 (2번 완료 후 시작)</p>
          <hr style={{ margin: "10px 0", border: "none", borderTop: "1px solid #ddd" }} />
          <p><strong>병렬 실행 시:</strong> 약 2초 (max 시간)</p>
          <p>모든 요청을 동시에 시작하면 가장 느린 요청(2초)만 기다리면 됩니다!</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "15px",
          padding: "15px",
          background: "#e3f2fd",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ fontSize: "14px", marginBottom: "10px" }}>
          💡 해결 방법
        </h4>
        <ol style={{ fontSize: "12px", color: "#666", lineHeight: "1.8", paddingLeft: "20px" }}>
          <li>
            <strong>Prefetching</strong>: 서버 컴포넌트에서 모든 데이터를 병렬로 prefetch
          </li>
          <li>
            <strong>Parallel Routes</strong>: Next.js의 병렬 라우트 기능 사용
          </li>
          <li>
            <strong>useSuspenseQueries</strong>: 여러 쿼리를 동시에 실행
          </li>
        </ol>
      </div>
    </div>
  );
}
