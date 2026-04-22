"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/posts";

export default function PostsList() {
  // ✨ useSuspenseQuery: 데이터가 준비될 때까지 Suspense를 트리거
  const { data } = useSuspenseQuery({
    queryKey: ["posts-streaming"],
    queryFn: getPosts,
  });

  return (
    <div
      style={{
        padding: "20px",
        background: "#e3f2fd",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h2>📝 Posts ({data?.posts?.length || 0}개)</h2>
      <div style={{ marginTop: "10px" }}>
        {data?.posts?.slice(0, 3).map((post: any) => (
          <div
            key={post.id}
            style={{
              padding: "10px",
              background: "white",
              marginBottom: "8px",
              borderRadius: "4px",
            }}
          >
            <strong>{post.title}</strong>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}>
              {post.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
