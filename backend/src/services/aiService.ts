import axios from 'axios';

interface ReplicateResponse {
  output: string; // Define the expected type for the output
}

export const generateImageFromPrompt = async (prompt: string) => {
  try {
    const response = await axios.post<ReplicateResponse>(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'your-model-version', // Replace with your model version
        input: { prompt },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      }
    );
    return response.data.output; // TypeScript now knows the type of response.data
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};