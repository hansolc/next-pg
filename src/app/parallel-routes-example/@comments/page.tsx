import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Comments from "@/app/components/Comments/Client";
import { getComments } from "@/services/comments";

export default async function CommentsSlot() {
  console.log("📍 [@comments 슬롯] 렌더링 시작");
  // eslint-disable-next-line
  const startTime = Date.now();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts-comments-parallel-routes"],
    queryFn: getComments,
  });

  // eslint-disable-next-line
  const duration = Date.now() - startTime;
  console.log(`📍 [@comments 슬롯] 렌더링 완료 (${duration}ms)`);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments />
    </HydrationBoundary>
  );
}
