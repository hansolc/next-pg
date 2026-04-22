export async function getComments() {
  const startTime = Date.now();
  const isServer = typeof window === "undefined";
  console.log(
    `💬 [getComments] 시작 ${isServer ? "🟦 SERVER" : "🟨 CLIENT"}`
  );

  try {
    // 인위적인 delay (2초) - waterfall 차이를 명확하게 보기 위함
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const res = await fetch("https://dummyjson.com/comments");
    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }
    const data = await res.json();

    const duration = Date.now() - startTime;
    console.log(
      `✅ [getComments] 완료 (${duration}ms) ${isServer ? "🟦 SERVER" : "🟨 CLIENT"}`
    );

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
