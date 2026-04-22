"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

interface PostAuthorProps {
  userId: number;
}

// 가상의 API 함수
async function getUserInfo(userId: number) {
  console.log(`  🚀 getUserInfo(${userId}) 시작`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: userId,
    name: "홍길동",
    email: "hong@example.com",
  };
}

export default function PostAuthor({ userId }: PostAuthorProps) {
  const startTime = Date.now();
  console.log("🌊 3️⃣ [PostAuthor] 컴포넌트 렌더링 시작");

  // 세 번째 요청: 작성자 정보
  // ⚠️ PostDetail이 렌더링된 후에야 이 요청이 시작됩니다!
  // 이것이 바로 Request Waterfall입니다!
  const { data } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const result = await getUserInfo(userId);
      console.log(
        `  ✅ getUserInfo(${userId}) 완료 (${Date.now() - startTime}ms)`
      );
      console.log("\n🎉 모든 요청 완료! 하지만 순차적으로 실행되었습니다.\n");
      return result;
    },
  });

  console.log(`✅ 3️⃣ [PostAuthor] 데이터 로드 완료: ${data.name}`);

  return (
    <div
      style={{
        padding: "10px",
        background: "#ffebee",
        borderRadius: "4px",
        marginTop: "10px",
      }}
    >
      <h4>👤 작성자 정보</h4>
      <p style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}>
        <strong>이름:</strong> {data.name}
      </p>
      <p style={{ color: "#666", fontSize: "14px" }}>
        <strong>이메일:</strong> {data.email}
      </p>
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          background: "white",
          borderRadius: "4px",
        }}
      >
        <strong>⚠️ 문제점:</strong>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          각 컴포넌트가 순차적으로 렌더링되면서 요청도 순차적으로 발생했습니다.
          총 3개의 요청이 약 3초가 걸렸지만, 병렬로 실행했다면 1초면
          충분했을 것입니다!
        </p>
      </div>
    </div>
  );
}
