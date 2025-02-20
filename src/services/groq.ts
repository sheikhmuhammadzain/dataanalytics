// We don't need to import or initialize Groq in the frontend anymore
// since we're using the backend server

export async function getChatCompletion(prompt: string, context: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        context,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get chat completion');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error getting chat completion:", error);
    throw error;
  }
}