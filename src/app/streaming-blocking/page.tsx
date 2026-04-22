import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/app/utils/tanstack-query";
import { getPosts } from "@/services/posts";
import { getComments } from "@/services/comments";
import PostsList from "./PostsList";
import CommentsList from "./CommentsList";

export default async function StreamingBlockingPage() {
  // eslint-disable-next-line
  const pageStartTime = Date.now();
  console.log("\n🔴 [BLOCKING 버전] 페이지 렌더링 시작\n");

  const queryClient = getQueryClient();

  // ⏳ BLOCKING: 모든 prefetch가 완료될 때까지 await으로 대기
  console.log("⏳ Posts 로딩 시작...");
  await queryClient.prefetchQuery({
    queryKey: ["posts-blocking"],
    queryFn: getPosts,
  });
  console.log("✅ Posts 로딩 완료");

  console.log("⏳ Comments 로딩 시작...");
  await queryClient.prefetchQuery({
    queryKey: ["comments-blocking"],
    queryFn: getComments,
  });
  console.log("✅ Comments 로딩 완료");

  // eslint-disable-next-line
  const pageDuration = Date.now() - pageStartTime;
  console.log(`\n🔴 [BLOCKING 버전] 전체 소요 시간: ${pageDuration}ms\n`);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <div
          style={{
            background: "#ffebee",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h1>🔴 BLOCKING 버전 (await 사용)</h1>
          <p style={{ marginTop: "10px", color: "#666" }}>
            <strong>동작 방식:</strong> 모든 데이터를 <code>await</code>로
            기다린 후 화면 렌더링
          </p>
          <p style={{ color: "#666" }}>
            <strong>결과:</strong> Posts(2초) + Comments(2초) = 총 4초 이상 대기
          </p>
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
            💡 콘솔에서 로딩 순서를 확인하세요!
          </p>
        </div>

        <PostsList />
        <CommentsList />
      </div>
    </HydrationBoundary>
  );
}
