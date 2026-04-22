"use client";

import { Suspense } from "react";
import PostsList from "./PostsList";
import CommentsList from "./CommentsList";

/**
 * 🔴 실험적 기능: ReactQueryStreamedHydration
 *
 * 이 페이지는 prefetchQuery를 전혀 사용하지 않습니다!
 * 대신 useSuspenseQuery만 사용하면 서버에서 자동으로 데이터를 가져옵니다.
 */
export default function ExperimentalStreamingPage() {
  console.log("\n🔴 [EXPERIMENTAL] 페이지 렌더링 시작 (prefetch 없음!)\n");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div
        style={{
          background: "#ffebee",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h1>🔴 EXPERIMENTAL: ReactQueryStreamedHydration</h1>
        <p style={{ marginTop: "10px", color: "#666" }}>
          <strong>동작 방식:</strong> prefetchQuery를 전혀 사용하지 않습니다!
        </p>
        <p style={{ color: "#666" }}>
          useSuspenseQuery만 사용하면 서버에서 자동으로 데이터를 가져옵니다.
        </p>
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
          💡 콘솔에서 서버 로그를 확인하세요!
        </p>
      </div>

      <Suspense
        fallback={
          <div
            style={{
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <p>⏳ Posts 로딩 중...</p>
          </div>
        }
      >
        <PostsList />
      </Suspense>

      <Suspense
        fallback={
          <div
            style={{
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p>⏳ Comments 로딩 중...</p>
          </div>
        }
      >
        <CommentsList />
      </Suspense>
    </div>
  );
}
