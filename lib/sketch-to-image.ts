import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export async function generateImageFromSketch(sketch: string) {
    try {
      const response = await hf.imageToImage({
        model: "TencentARC/t2i-adapter-sketch-sdxl-1.0",
        inputs: {
          image: sketch,
        },
      });
      return response;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
  
