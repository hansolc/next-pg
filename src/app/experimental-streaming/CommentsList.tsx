"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getComments } from "@/services/comments";

export default function CommentsList() {
  console.log("📌 [CommentsList] 컴포넌트 렌더링 시작");

  // ✨ prefetchQuery 없이 useSuspenseQuery만 사용!
  const { data } = useSuspenseQuery({
    queryKey: ["comments-experimental"],
    queryFn: getComments,
  });

  console.log("✅ [CommentsList] 데이터 로드 완료:", data?.comments?.length, "개");

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
            <strong>{comment.name}</strong>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}>
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
