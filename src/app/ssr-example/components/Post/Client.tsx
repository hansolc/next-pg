"use client";

import { getPosts } from "@/services/posts";
import { useQuery } from "@tanstack/react-query";

const PostClient = () => {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  return <div>{JSON.stringify(posts)}</div>;
};

export default PostClient;
