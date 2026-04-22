import { ReactNode } from "react";

export default function ParallelRoutesLayout({
  children,
  posts,
  comments,
}: {
  children: ReactNode;
  posts: ReactNode;
  comments: ReactNode;
}) {
  console.log("\n🔀 [PARALLEL ROUTES 버전] Layout 렌더링\n");

  return (
    <div>
      <h1 style={{ padding: "20px", background: "#e3f2fd" }}>
        PARALLEL ROUTES 버전 (Layout + @slots)
      </h1>
      <div style={{ padding: "20px" }}>
        <p style={{ marginBottom: "10px", color: "#666" }}>
          ℹ️ Next.js가 @posts와 @comments를 자동으로 병렬 로딩합니다
        </p>
        {children}
        {posts}
        {comments}
      </div>
    </div>
  );
}
