import { HfInference } from '@huggingface/inference';

const API_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
const MODEL_ID = "kandinsky-community/kandinsky-2-2-decoder";

const hf = new HfInference(API_TOKEN);

export async function generateImageFromSketch(sketch: string, prompt: string) {
  try {
    const response = await hf.textToImage({
      model: MODEL_ID,
      inputs: {
        prompt: prompt,
        image: sketch,
        negative_prompt: "extra digit, fewer digits, cropped, worst quality, low quality, glitch, deformed, mutated, ugly, disfigured",
        num_inference_steps: 30,
        adapter_conditioning_scale: 0.9,
        guidance_scale: 7.5
      }
    });
    return response;
  } catch (error:any) {
    if (error.message?.includes('loading')) {
      throw new Error('Model is currently loading. Please wait a few moments and try again.');
    }
    console.error('Error in generateImageFromSketch:', error);
    throw error;
  }
}
