import { getComments } from "@/services/comments";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import CommentsClient from "./Client";

export default async function CommentsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["comments"],
    queryFn: getComments,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentsClient />
    </HydrationBoundary>
  );
}
