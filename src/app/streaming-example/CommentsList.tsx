"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getComments } from "@/services/comments";

export default function CommentsList() {
  // ✨ useSuspenseQuery: 데이터가 준비될 때까지 Suspense를 트리거
  const { data } = useSuspenseQuery({
    queryKey: ["comments-streaming"],
    queryFn: getComments,
  });

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
