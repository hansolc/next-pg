import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Posts from "@/app/components/Post/Client";
import Comments from "@/app/components/Comments/Client";
import { getPosts } from "@/services/posts";
import { getComments } from "@/services/comments";

export default async function ParallelPage() {
  // eslint-disable-next-line
  const pageStartTime = Date.now();
  console.log("\n🚀 [PARALLEL 버전] 페이지 렌더링 시작\n");

  const queryClient = new QueryClient();

  // PARALLEL: 두 개의 prefetch를 동시에 실행
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["posts-parallel"],
      queryFn: getPosts,
    }),
    queryClient.prefetchQuery({
      queryKey: ["posts-comments-parallel"],
      queryFn: getComments,
    }),
  ]);

  // eslint-disable-next-line
  const pageDuration = Date.now() - pageStartTime;
  console.log(`\n🚀 [PARALLEL 버전] 전체 소요 시간: ${pageDuration}ms\n`);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 style={{ padding: "20px", background: "#e8f5e9" }}>
        PARALLEL 버전 (병렬 실행 - Promise.all)
      </h1>
      <Posts />
      <Comments />
    </HydrationBoundary>
  );
}
