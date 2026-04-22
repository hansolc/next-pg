"use client";

import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/services/comments";

export default function CommentsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["comments-blocking"],
    queryFn: getComments,
  });

  if (isLoading) {
    return (
      <div
        style={{
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <p>⏳ Comments 로딩 중...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff3e0",
        borderRadius: "8px",
      }}
    >
      <h2>💬 Comments ({data?.comments?.length || 0}개)</h2>
      <div style={{ marginTop: "10px" }}>
        {data?.comments?.slice(0, 3).map((comment: any) => (
          <div
            key={comment.id}
            style={{
              padding: "10px",
              background: "white",
              marginBottom: "8px",
              borderRadius: "4px",
            }}
          >
            <strong>{comment.user?.username}</strong>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}>
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
