export async function getComments() {
  try {
    const res = await fetch("https://dummyjson.com/comments");
    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
