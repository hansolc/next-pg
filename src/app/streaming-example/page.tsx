import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import getQueryClient from "@/app/utils/tanstack-query";
import { getPosts } from "@/services/posts";
import { getComments } from "@/services/comments";
import { Suspense } from "react";
import PostsList from "./PostsList";
import CommentsList from "./CommentsList";

export default function StreamingPage() {
  const pageStartTime = Date.now();
  console.log("\n🟢 [STREAMING 버전] 페이지 렌더링 시작\n");

  const queryClient = getQueryClient();

  // ✨ STREAMING: await 없이 prefetch 시작만 함 (v5.40.0+)
  // pending 쿼리가 dehydrate되어 클라이언트로 전송됨
  console.log("🚀 Posts prefetch 시작 (await 없음)");
  queryClient.prefetchQuery({
    queryKey: ["posts-streaming"],
    queryFn: getPosts,
  });

  console.log("🚀 Comments prefetch 시작 (await 없음)");
  queryClient.prefetchQuery({
    queryKey: ["comments-streaming"],
    queryFn: getComments,
  });

  const pageDuration = Date.now() - pageStartTime;
  console.log(
    `\n🟢 [STREAMING 버전] 페이지 렌더링 완료: ${pageDuration}ms (즉시 반환!)\n`
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <div
          style={{
            background: "#e8f5e9",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h1>🟢 STREAMING 버전 (await 미사용 + Suspense)</h1>
          <p style={{ marginTop: "10px", color: "#666" }}>
            <strong>동작 방식:</strong> <code>await</code> 없이 prefetch만 시작하고
            즉시 화면 렌더링
          </p>
          <p style={{ color: "#666" }}>
            <strong>결과:</strong> 화면은 즉시 표시되고, 각 데이터가 준비되는 대로
            Suspense가 해제되어 표시됨
          </p>
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
            💡 콘솔에서 로딩 순서를 확인하세요! 그리고 화면이 점진적으로
            로딩되는 것을 보세요!
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
    </HydrationBoundary>
  );
}
