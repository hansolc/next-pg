"use client";

import { Suspense } from "react";
import PostsList from "./PostsList";

/**
 * 🌊 REQUEST WATERFALL 예제
 *
 * 이 예제는 왜 request waterfall이 발생하는지 보여줍니다.
 * 컴포넌트가 중첩되어 있고, 각 컴포넌트가 데이터를 필요로 할 때
 * 순차적으로 요청이 발생합니다.
 */
export default function WaterfallExamplePage() {
  console.log("\n🌊 [WATERFALL] 페이지 렌더링 시작\n");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div
        style={{
          background: "#e1f5fe",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h1>🌊 REQUEST WATERFALL 예제</h1>
        <p style={{ marginTop: "10px", color: "#666" }}>
          <strong>문제점:</strong> 컴포넌트 렌더링 순서에 따라 데이터 요청이
          순차적으로 발생합니다.
        </p>
        <p style={{ color: "#666" }}>
          PostsList → PostDetail → PostAuthor 순서로 요청이 발생합니다.
        </p>
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            background: "white",
            borderRadius: "4px",
          }}
        >
          <strong>Request Waterfall 흐름:</strong>
          <pre
            style={{
              marginTop: "10px",
              fontSize: "12px",
              color: "#666",
              fontFamily: "monospace",
            }}
          >
            {`1. |> getPosts()          (페이지 이동 시)
2.   |> getPostDetail()    (PostsList 렌더링 후)
3.     |> getPostAuthor()  (PostDetail 렌더링 후)

각 요청이 이전 요청이 완료되어야 시작됩니다!`}
          </pre>
        </div>
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
          💡 브라우저 Network 탭과 콘솔 로그를 확인하세요!
        </p>
      </div>

      <Suspense
        fallback={
          <div
            style={{
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p>⏳ 1단계: Posts 로딩 중...</p>
          </div>
        }
      >
        <PostsList />
      </Suspense>
    </div>
  );
}
