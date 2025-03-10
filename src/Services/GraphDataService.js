
export const fetchGraphData = async (fileName) => {
  const response = await fetch(`http://localhost:8000/files/json/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${fileName}`);
  }
  const data = await response.json();
  return data;
};
