"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/posts";
import { useState, useEffect } from "react";

/**
 * 🔵 클라이언트 컴포넌트
 * 
 * 이 컴포넌트는:
 * 1. 초기 로드: 서버에서 렌더링 (SSR) → useSuspenseQuery가 서버에서 실행
 * 2. 클라이언트: Hydration 시 서버에서 가져온 데이터 사용
 * 3. 페이지 이동 후 재방문: 클라이언트에서만 렌더링 → useSuspenseQuery가 클라이언트에서 실행
 */
export default function ExperimentalClientComponent() {
  const [renderLocation, setRenderLocation] = useState<"server" | "client">("server");
  const [hydrated, setHydrated] = useState(false);

  // 클라이언트에서만 실행되는 effect
  useEffect(() => {
    console.log("🟨 [CLIENT] Hydration 완료 - 이제 클라이언트에서 실행 중");
    setHydrated(true);
    setRenderLocation("client");
  }, []);

  const isServer = typeof window === "undefined";
  
  if (isServer) {
    console.log("🟦 [SERVER] 클라이언트 컴포넌트가 서버에서 렌더링 중 (SSR)");
    console.log("🟦 [SERVER] useSuspenseQuery 호출 직전...");
  } else if (!hydrated) {
    console.log("🟨 [CLIENT] 초기 hydration 중...");
  }

  // ✨ ReactQueryStreamedHydration 덕분에
  // 이 useSuspenseQuery가 서버에서 실행됩니다!
  const { data } = useSuspenseQuery({
    queryKey: ["posts-server-demo"],
    queryFn: async () => {
      const location = typeof window === "undefined" ? "🟦 SERVER" : "🟨 CLIENT";
      console.log(`${location} queryFn 실행 중...`);
      const result = await getPosts();
      console.log(`${location} queryFn 완료!`);
      return result;
    },
  });

  if (isServer) {
    console.log("🟦 [SERVER] useSuspenseQuery 완료 - 데이터 획득!");
    console.log("🟦 [SERVER] 이 데이터를 클라이언트로 전송합니다...\n");
  }

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
        <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
          📍 현재 렌더링 위치:
        </h3>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {isServer ? "🟦 SERVER (SSR)" : hydrated ? "🟨 CLIENT (Hydrated)" : "🟡 CLIENT (Hydrating...)"}
        </div>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          {isServer
            ? "서버에서 렌더링 중입니다. useSuspenseQuery도 서버에서 실행됩니다!"
            : hydrated
            ? "클라이언트에서 hydration 완료. 서버에서 가져온 데이터를 사용합니다!"
            : "클라이언트에서 hydration 진행 중..."}
        </p>
      </div>

      <h2>📝 Posts ({data?.posts?.length || 0}개)</h2>
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
        이 데이터는 {isServer ? "서버" : "서버에서 fetch되어 클라이언트로 전송된"}에서 가져왔습니다.
      </p>

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

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>🧪 실험 방법:</h3>
        <ol style={{ fontSize: "12px", color: "#666", lineHeight: "1.8", paddingLeft: "20px" }}>
          <li>
            <strong>새로고침 (F5)</strong>: 터미널에서 🟦 SERVER 로그 확인
            <br />→ 서버에서 fetch 발생
          </li>
          <li>
            <strong>다른 페이지로 이동</strong> (예: 홈으로) 후 <strong>다시 돌아오기</strong>
            <br />→ 브라우저 콘솔에서 🟨 CLIENT 로그 확인
            <br />→ staleTime(60초)이 지났다면 클라이언트에서 refetch 발생
          </li>
          <li>
            <strong>Network 탭 확인</strong>: 새로고침 시 별도 API 요청 없이 HTML에 데이터 포함
          </li>
        </ol>
      </div>
    </div>
  );
}
