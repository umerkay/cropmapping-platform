
export const fetchGraphData = async (fileName) => {
  const response = await fetch(`https://umerkk164-agro-chatbot.hf.space/files/json/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${fileName}`);
  }
  const data = await response.json();
  return data;
};
