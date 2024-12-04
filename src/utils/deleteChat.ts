export default async function deleteChat(userId: string, chatId: string): Promise<string> {
  try {
    const response = await fetch(`/api/chat/${userId}/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error(error);
    throw error;
  }
}