import axios from 'axios';

export const generateImageFromPrompt = async (prompt: string) => {
  try {
    const response = await axios.post(
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
    return response.data.output; // URL of the generated image
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};