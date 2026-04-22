import { Suspense } from "react";
import ExperimentalClientComponent from "./ExperimentalClientComponent";

/**
 * 🔴 서버 컴포넌트 (use client 없음)
 * 
 * 이 컴포넌트는 항상 서버에서만 실행됩니다.
 * ReactQueryStreamedHydration 덕분에 자식 클라이언트 컴포넌트의
 * useSuspenseQuery가 서버에서 자동으로 실행됩니다!
 */
export default function ExperimentalServerPage() {
  const isServer = typeof window === "undefined";
  console.log(
    `\n🔴 [SERVER COMPONENT] 페이지 렌더링 - ${
      isServer ? "🟦 SERVER" : "🟨 CLIENT (절대 일어나면 안됨!)"
    }\n`
  );

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
        <h1>🔴 ReactQueryStreamedHydration 작동 원리</h1>
        
        <div style={{ marginTop: "15px", padding: "15px", background: "white", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>🏗️ 컴포넌트 구조:</h3>
          <pre style={{ fontSize: "12px", color: "#666", fontFamily: "monospace", lineHeight: "1.8" }}>
{`📦 ExperimentalServerPage (서버 컴포넌트)
  └─ 🔵 ExperimentalClientComponent (클라이언트 컴포넌트)
       └─ useSuspenseQuery (서버에서 자동 fetch!)
`}
          </pre>
        </div>

        <div style={{ marginTop: "15px", padding: "15px", background: "#fff3e0", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>✨ 핵심 동작:</h3>
          <ol style={{ fontSize: "14px", color: "#666", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>서버 컴포넌트</strong>가 렌더링 시작</li>
            <li><strong>클라이언트 컴포넌트</strong>가 서버에서 렌더링됨 (SSR)</li>
            <li>useSuspenseQuery 호출 → <strong>서버에서 fetch 시작</strong></li>
            <li>데이터를 Promise로 serialize하여 클라이언트로 전송</li>
            <li>클라이언트에서 hydration 시 Promise 복원</li>
          </ol>
        </div>

        <div style={{ marginTop: "15px", padding: "15px", background: "#e3f2fd", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>🔍 확인 방법:</h3>
          <ul style={{ fontSize: "14px", color: "#666", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>터미널에서 <strong>🟦 SERVER</strong> 로그 확인</li>
            <li>브라우저 콘솔에서 <strong>🟨 CLIENT (Hydration)</strong> 로그 확인</li>
            <li>Network 탭: 별도 API 요청 없이 HTML에 데이터 포함</li>
            <li>새로고침 vs 페이지 이동 후 재방문 비교</li>
          </ul>
        </div>
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
            <p>⏳ 데이터 로딩 중...</p>
          </div>
        }
      >
        <ExperimentalClientComponent />
      </Suspense>
    </div>
  );
}
