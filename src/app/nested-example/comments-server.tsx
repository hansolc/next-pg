import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Comments from "@/app/components/Comments/Client";
import { getComments } from "@/services/comments";

export default async function CommentsServerComponent() {
  // eslint-disable-next-line
  const componentStartTime = Date.now();
  console.log("📦 [CommentsServerComponent] 렌더링 시작");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts-comments-nested"],
    queryFn: getComments,
  });

  // eslint-disable-next-line
  const componentDuration = Date.now() - componentStartTime;
  console.log(
    `📦 [CommentsServerComponent] 렌더링 완료 (${componentDuration}ms)`
  );

  return <HydrationBoundary state={dehydrate(queryClient)}></HydrationBoundary>;
}
