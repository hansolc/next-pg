"use client";

export default function Home() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        TanStack Query + Next.js SSR 예제
      </h1>
      <p style={{ color: "#666", marginBottom: "40px" }}>
        다양한 SSR 패턴을 비교하고 이해하기 위한 예제들입니다.
      </p>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {/* 🆕 서버 컴포넌트 데모 */}
        <a
          href="/experimental-server-demo"
          style={{
            display: "block",
            padding: "24px",
            background: "#f3e5f5",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #9c27b0";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              background: "#9c27b0",
              color: "white",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            ⭐ 추천
          </div>
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🔴 서버 컴포넌트에서 작동 확인
          </h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            <strong>서버 컴포넌트</strong> 안에서{" "}
            <strong>클라이언트 컴포넌트</strong>의 useSuspenseQuery가 서버에서
            실행되는 것을 명확히 확인할 수 있습니다.
          </p>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
            💡 터미널에서 🟦 SERVER 로그 확인! Hydration 과정도 명확하게
            표시됩니다.
          </p>
        </a>

        {/* 🆕 Waterfall 서버 데모 */}
        <a
          href="/waterfall-server-demo"
          style={{
            display: "block",
            padding: "24px",
            background: "#e8eaf6",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #3f51b5";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              background: "#3f51b5",
              color: "white",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            ⭐ 추천
          </div>
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🌊 Waterfall - 서버 vs 클라이언트
          </h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            <strong>서버 컴포넌트</strong> 구조에서 Waterfall이 발생하는 과정을
            단계별로 확인합니다. 서버와 클라이언트에서의 차이를 명확히
            보여줍니다.
          </p>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
            💡 새로고침 vs 페이지 이동 후 재방문을 비교하세요!
          </p>
        </a>

        {/* 실험적 스트리밍 */}
        <a
          href="/experimental-streaming"
          style={{
            display: "block",
            padding: "24px",
            background: "#ffebee",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #f44336";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🔴 Experimental (기본 예제)
          </h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            <strong>prefetchQuery 없이</strong> useSuspenseQuery만 사용하는
            실험적 기능입니다. (모든 컴포넌트가 "use client"로 선언됨)
          </p>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
            💡 서버 로그를 확인하여 서버에서 fetch가 일어나는지 확인하세요!
          </p>
        </a>

        {/* Waterfall 예제 */}
        <a
          href="/waterfall-example"
          style={{
            display: "block",
            padding: "24px",
            background: "#e1f5fe",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #03a9f4";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🌊 Waterfall (기본 예제)
          </h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            중첩된 컴포넌트가 <strong>순차적으로</strong> 데이터를 요청하면서
            발생하는 Request Waterfall 문제를 시연합니다. (모든 컴포넌트가 "use
            client")
          </p>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
            💡 페이지 이동 시 3개의 요청이 순차적으로 발생하는 것을 확인하세요!
          </p>
        </a>

        {/* Streaming 예제 */}
        <a
          href="/streaming-example"
          style={{
            display: "block",
            padding: "24px",
            background: "#e8f5e9",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #4caf50";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🟢 Streaming with Prefetching
          </h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            prefetchQuery를 사용하되 <strong>await 하지 않고</strong> pending
            쿼리를 dehydrate하여 스트리밍하는 방식입니다. (v5.40.0+)
          </p>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
            💡 화면이 즉시 표시되고 데이터가 준비되는 대로 나타납니다!
          </p>
        </a>

        {/* Blocking 예제 */}
        <a
          href="/streaming-blocking"
          style={{
            display: "block",
            padding: "24px",
            background: "#fff3e0",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #ff9800";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🟠 Blocking with Await
          </h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            전통적인 방식으로 prefetchQuery를 <strong>await</strong>하여 모든
            데이터가 준비될 때까지 기다립니다.
          </p>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
            💡 모든 데이터가 준비된 후 한 번에 화면이 표시됩니다.
          </p>
        </a>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "24px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
          📚 핵심 개념 정리
        </h3>
        <ul style={{ color: "#666", fontSize: "14px", lineHeight: "2" }}>
          <li>
            <strong>ReactQueryStreamedHydration:</strong> prefetchQuery 없이
            useSuspenseQuery만으로 서버에서 자동 fetch (실험적 기능)
          </li>
          <li>
            <strong>서버 컴포넌트 vs 클라이언트 컴포넌트:</strong> "use client"가
            있어도 SSR 시 서버에서 렌더링됨
          </li>
          <li>
            <strong>Request Waterfall:</strong> 컴포넌트 렌더링 순서에 따라
            요청이 순차적으로 발생하는 문제
          </li>
          <li>
            <strong>Streaming SSR:</strong> 데이터가 준비되는 대로 점진적으로
            화면에 표시
          </li>
          <li>
            <strong>Blocking SSR:</strong> 모든 데이터가 준비될 때까지 기다린 후
            화면 표시
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#e3f2fd",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
          🔍 확인할 사항
        </h3>
        <ol style={{ color: "#666", fontSize: "14px", lineHeight: "2" }}>
          <li>
            <strong>새로고침 (F5)</strong>: 터미널(서버) 로그에서{" "}
            <strong>🟦 SERVER</strong> 표시 확인
            <br />→ 서버에서 fetch가 일어나는 것을 확인할 수 있습니다
          </li>
          <li>
            <strong>페이지 이동 후 재방문</strong>: 브라우저 콘솔에서{" "}
            <strong>🟨 CLIENT</strong> 표시 확인
            <br />→ staleTime(60초)이 지나면 클라이언트에서 refetch 발생
          </li>
          <li>
            브라우저 개발자 도구의 <strong>Network 탭</strong>에서 요청 순서
            확인
            <br />→ 초기 로드 시 별도 API 요청 없이 HTML에 데이터가 포함됨
          </li>
          <li>각 예제의 TTFB(Time To First Byte)와 로딩 시간 비교</li>
        </ol>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#f3e5f5",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
          ⭐ 추천 학습 순서
        </h3>
        <ol style={{ color: "#666", fontSize: "14px", lineHeight: "2" }}>
          <li>
            <strong>서버 컴포넌트에서 작동 확인</strong>{" "}
            (/experimental-server-demo)
            <br />→ ReactQueryStreamedHydration의 기본 동작 이해
          </li>
          <li>
            <strong>Waterfall - 서버 vs 클라이언트</strong>{" "}
            (/waterfall-server-demo)
            <br />→ 서버와 클라이언트에서의 waterfall 차이 확인
          </li>
          <li>
            <strong>Streaming vs Blocking 비교</strong>
            <br />→ 두 방식의 성능 차이 체감
          </li>
        </ol>
      </div>
    </div>
  );
}
