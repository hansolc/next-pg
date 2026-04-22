"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/posts";

export default function PostsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["posts-blocking"],
    queryFn: getPosts,
  });

  if (isLoading) {
    return (
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
    );
  }

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
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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
