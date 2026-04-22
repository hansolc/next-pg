import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Posts from "@/app/components/Post/Client";
import { getPosts } from "@/services/posts";
import CommentsServerComponent from "./comments-server";

export default async function PostsPage() {
  const pageStartTime = Date.now();
  console.log("\n⏱️  [WATERFALL 버전] 페이지 렌더링 시작\n");

  const queryClient = new QueryClient();

  // WATERFALL: posts가 완료될 때까지 기다린 후 CommentsServerComponent 렌더링
  await queryClient.prefetchQuery({
    queryKey: ["posts-nested"],
    queryFn: getPosts,
  });

  // CommentsServerComponent가 완전히 렌더링될 때까지 대기
  const commentsComponent = await CommentsServerComponent();

  const pageDuration = Date.now() - pageStartTime;
  console.log(`\n⏱️  [WATERFALL 버전] 전체 소요 시간: ${pageDuration}ms\n`);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 style={{ padding: "20px", background: "#f0f0f0" }}>
        WATERFALL 버전 (순차 실행)
      </h1>
      <Posts />
      {commentsComponent}
    </HydrationBoundary>
  );
}
