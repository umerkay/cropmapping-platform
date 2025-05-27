const API_URL = "https://umerkk164-agro-chatbot.hf.space/chat";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtbC10ZWFtIiwiaWF0IjoxNzMyODE0ODg2LCJleHAiOjE3NDA1OTA4ODYsImp0aSI6ImQ1NzI3YWU4YTEyMmJhNjcwZTc4MDMyNWI4Y2E5MmY5Iiwicm9sZSI6ImFkbWluIn0.DYR6roeo8YiEDUAvcVZGHY5sYcY5yzpTPuuqLxcZ8Wc";

export async function sendMessage(userInput, conversationId, setMessages, toolUse, setToolUse) {
  const formData = new FormData();
  formData.append('user_id', 'umer:vyro');
  formData.append('conversation_id', conversationId);
  formData.append('prompt', userInput);
  formData.append('agent_model', 'gpt-4o-mini');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    let botReply = '';
    const decoder = new TextDecoder('utf-8');

    // Append an empty assistant message first
    let assistantMessage = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMessage]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      const messages = chunk
        .split('\n')
        .filter((line) => line.startsWith('data: '));

      for (let message of messages) {
        try {
          const jsonChunk = JSON.parse(message.replace('data: ', '').trim());
          const content = jsonChunk.choices[0]?.delta?.content || '';
          const toolName = jsonChunk.choices[0]?.delta?.tool || '';

          if (toolName) {
            setToolUse({ name: toolName, content });
            continue;
          } else {
            setToolUse({ name: '', content: '' });
          }

          if (content) {
            botReply += content;
            setMessages((prev) => {
              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = {
                ...updatedMessages[updatedMessages.length - 1],
                content: botReply,
              };
              return updatedMessages;
            });
          }
        } catch (e) {
          console.error('Error parsing chunk: ', e);
        }
      }
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}
