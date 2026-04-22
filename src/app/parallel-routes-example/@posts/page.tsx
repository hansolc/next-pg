import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Posts from "@/app/components/Post/Client";
import { getPosts } from "@/services/posts";

export default async function PostsSlot() {
  console.log("📍 [@posts 슬롯] 렌더링 시작");
  // eslint-disable-next-line
  const startTime = Date.now();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts-parallel-routes"],
    queryFn: getPosts,
  });

  // eslint-disable-next-line
  const duration = Date.now() - startTime;
  console.log(`📍 [@posts 슬롯] 렌더링 완료 (${duration}ms)`);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
