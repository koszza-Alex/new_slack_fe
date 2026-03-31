export const addReaction = async (messageId: string, emoji: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SOCKET_URL}/messages/${messageId}/reactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emoji }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add reaction");
  }

  return res.json();
};