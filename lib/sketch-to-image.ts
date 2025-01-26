import { HfInference } from '@huggingface/inference';

const API_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
const MODEL_ID = "kandinsky-community/kandinsky-2-2-decoder";
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const hf = new HfInference(API_TOKEN || '');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateImageFromSketch(sketch: string, prompt: string) {
  if (!API_TOKEN) {
    throw new Error('Hugging Face API token not found. Please check your environment variables.');
  }

  console.log('🚀 Starting image generation with HF...', { model: MODEL_ID, prompt });

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      console.log(`📡 Sending request to HF API (Attempt ${retries + 1}/${MAX_RETRIES})`);
      const response = await hf.imageToImage({
        model: MODEL_ID,
        inputs: {
          image: sketch,
          prompt: prompt,
          negative_prompt: "blurry, bad quality, distorted",
          num_inference_steps: 25,
          strength: 0.75
        }
      });
      console.log('✅ Successfully received response from HF:', { 
        type: response.type,
        size: response.size,
      });
      return response;
    } catch (error: any) {
      if (error.message?.includes('loading') && retries < MAX_RETRIES - 1) {
        console.log(`⏳ Model is loading, retrying in ${RETRY_DELAY/1000} seconds... (Attempt ${retries + 1}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY);
        retries++;
        continue;
      }
      console.error('❌ Error in generateImageFromSketch:', error);
      throw error;
    }
  }
  throw new Error('Maximum retries reached while waiting for model to load');
}
