import Link from "next/link";

export default function StreamingComparisonPage() {
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
        📚 TanStack Query v5.40.0+ Streaming 비교
      </h1>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>핵심 개념</h2>
        <p style={{ marginBottom: "10px", lineHeight: "1.6" }}>
          <strong>v5.40.0부터의 주요 변경사항:</strong> <code>pending</code>{" "}
          상태의 쿼리도 dehydrate하여 클라이언트로 전송할 수 있습니다.
        </p>
        <p style={{ lineHeight: "1.6" }}>
          이를 통해 서버에서 <code>await</code> 없이 prefetch만 시작하고, 데이터가
          준비되는 대로 클라이언트에서 스트리밍으로 받을 수 있습니다.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div
          style={{
            background: "#ffebee",
            padding: "30px",
            borderRadius: "12px",
            border: "2px solid #ef5350",
          }}
        >
          <h2 style={{ color: "#d32f2f", marginBottom: "15px" }}>
            🔴 BLOCKING 버전
          </h2>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>동작 방식:</h3>
            <pre
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "6px",
                overflow: "auto",
                fontSize: "13px",
              }}
            >
              {`await queryClient.prefetchQuery({
  queryKey: ["posts"],
  queryFn: getPosts, // 2초 대기
});

await queryClient.prefetchQuery({
  queryKey: ["comments"],
  queryFn: getComments, // 2초 대기
});`}
            </pre>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>결과:</h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>
                <strong>총 대기 시간:</strong> 4초 이상
              </li>
              <li>
                <strong>사용자 경험:</strong> 빈 화면에서 4초 대기 후 모든 콘텐츠
                한번에 표시
              </li>
              <li>
                <strong>서버 부하:</strong> 모든 데이터가 준비될 때까지 응답 보류
              </li>
            </ul>
          </div>

          <Link
            href="/streaming-blocking"
            style={{
              display: "inline-block",
              background: "#d32f2f",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            🔴 BLOCKING 버전 체험하기 →
          </Link>
        </div>

        <div
          style={{
            background: "#e8f5e9",
            padding: "30px",
            borderRadius: "12px",
            border: "2px solid #66bb6a",
          }}
        >
          <h2 style={{ color: "#2e7d32", marginBottom: "15px" }}>
            🟢 STREAMING 버전
          </h2>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>동작 방식:</h3>
            <pre
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "6px",
                overflow: "auto",
                fontSize: "13px",
              }}
            >
              {`// await 없이 즉시 반환!
queryClient.prefetchQuery({
  queryKey: ["posts"],
  queryFn: getPosts,
});

queryClient.prefetchQuery({
  queryKey: ["comments"],
  queryFn: getComments,
});

// 클라이언트에서 useSuspenseQuery 사용`}
            </pre>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>결과:</h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>
                <strong>초기 응답:</strong> 즉시 반환 (거의 0ms)
              </li>
              <li>
                <strong>사용자 경험:</strong> 화면 즉시 표시, 데이터는 준비되는
                대로 점진적으로 표시
              </li>
              <li>
                <strong>서버 부하:</strong> 즉시 응답하고 데이터는 스트리밍으로 전송
              </li>
            </ul>
          </div>

          <Link
            href="/streaming-example"
            style={{
              display: "inline-block",
              background: "#2e7d32",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            🟢 STREAMING 버전 체험하기 →
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "#fff3e0",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>💡 체험 가이드</h2>
        <ol style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
          <li>
            각 버전을 클릭하여 체험해보세요 (각각 새 탭에서 열면 비교하기 쉽습니다)
          </li>
          <li>
            <strong>개발자 도구 콘솔</strong>을 열어서 서버 로그를 확인하세요 (터미널에 출력됨)
          </li>
          <li>
            <strong>Network 탭</strong>에서 응답 시간의 차이를 확인하세요
          </li>
          <li>
            <strong>화면의 렌더링 속도</strong>를 주의깊게 관찰하세요
          </li>
        </ol>
      </div>

      <div
        style={{
          marginTop: "30px",
          background: "#e3f2fd",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>🔧 설정 확인</h2>
        <p style={{ marginBottom: "10px" }}>
          Streaming을 사용하려면 <code>getQueryClient()</code>에서 다음 설정이 필요합니다:
        </p>
        <pre
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "6px",
            overflow: "auto",
            fontSize: "13px",
          }}
        >
          {`dehydrate: {
  shouldDehydrateQuery: (query) =>
    defaultShouldDehydrateQuery(query) ||
    query.state.status === "pending",
}`}
        </pre>
      </div>
    </div>
  );
}
