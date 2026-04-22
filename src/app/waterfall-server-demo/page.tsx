import { Suspense } from "react";
import WaterfallClientWrapper from "./WaterfallClientWrapper";

/**
 * 🌊 서버 컴포넌트로 시작
 * 
 * 이 예제는 Waterfall이 어떻게 발생하는지 보여줍니다:
 * 
 * [초기 로드 - SSR]
 * - 서버에서 모든 컴포넌트가 순차적으로 렌더링
 * - 각 useSuspenseQuery가 서버에서 순차 실행
 * - 터미널 로그에서 🟦 SERVER 확인 가능
 * 
 * [페이지 이동 후 재방문]
 * - 클라이언트에서 컴포넌트가 순차적으로 렌더링
 * - 각 useSuspenseQuery가 클라이언트에서 순차 실행
 * - 브라우저 콘솔에서 🟨 CLIENT 확인 가능
 */
export default function WaterfallServerPage() {
  const isServer = typeof window === "undefined";
  const timestamp = new Date().toISOString();
  
  console.log(`\n🌊 [WATERFALL SERVER PAGE] 렌더링 시작 - ${timestamp}`);
  console.log(`   위치: ${isServer ? "🟦 SERVER" : "🟨 CLIENT (절대 일어나면 안됨!)"}\n`);

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
        <h1>🌊 Request Waterfall - 서버 vs 클라이언트</h1>
        
        <div style={{ marginTop: "15px", padding: "15px", background: "white", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>🏗️ 컴포넌트 구조:</h3>
          <pre style={{ fontSize: "12px", color: "#666", fontFamily: "monospace", lineHeight: "1.8" }}>
{`📦 WaterfallServerPage (서버 컴포넌트)
  └─ 🔵 WaterfallClientWrapper (클라이언트 컴포넌트)
       └─ useSuspenseQuery ["posts-waterfall-v2"] ← 1️⃣ 첫 번째 fetch
            └─ 🔵 PostDetail (클라이언트 컴포넌트)
                 └─ useSuspenseQuery ["post-detail"] ← 2️⃣ 두 번째 fetch
                      └─ 🔵 PostAuthor (클라이언트 컴포넌트)
                           └─ useSuspenseQuery ["user"] ← 3️⃣ 세 번째 fetch
`}
          </pre>
        </div>

        <div style={{ marginTop: "15px", padding: "15px", background: "#fff3e0", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>⚠️ Waterfall이 발생하는 이유:</h3>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.8" }}>
            각 컴포넌트가 <strong>렌더링되어야만</strong> 그 안의 useSuspenseQuery가 실행됩니다.
            따라서 부모 컴포넌트의 데이터가 로드된 후에야 자식 컴포넌트가 렌더링되고,
            자식의 데이터 요청이 시작됩니다.
          </p>
        </div>

        <div style={{ marginTop: "15px", padding: "15px", background: "#ffebee", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>🔍 실험 방법:</h3>
          <ol style={{ fontSize: "14px", color: "#666", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>
              <strong>새로고침 (F5)</strong>: 터미널에서 서버 waterfall 확인
              <br />→ 3개의 요청이 순차적으로 발생 (약 4초)
            </li>
            <li>
              <strong>홈으로 이동 → 다시 돌아오기</strong>: 브라우저 콘솔에서 클라이언트 waterfall 확인
              <br />→ staleTime(60초)이 지났다면 동일한 waterfall 발생
            </li>
            <li>
              <strong>시간 측정</strong>: 각 단계의 시작/완료 시간 로그 확인
            </li>
          </ol>
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
            <p>⏳ 1단계: Posts 로딩 중...</p>
          </div>
        }
      >
        <WaterfallClientWrapper />
      </Suspense>
    </div>
  );
}
