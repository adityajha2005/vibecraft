const API_TOKEN = process.env.NEXT_PUBLIC_CLIPDROP_API_KEY;
const API_URL = 'https://clipdrop-api.co/sketch-to-image/v1/sketch-to-image';

// Helper function to convert data URL to File object with inverted colors
async function dataURLToSketchFile(dataURL: string): Promise<File> {
  // Create a temporary canvas to process the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Make the canvas square using the larger dimension
      const size = Math.max(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // First draw the image with its original colors
      ctx.drawImage(img, 0, 0);
      
      // Get the image data
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      
      // Set black background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, size, size);
      
      // Process the image data to make the sketch white
      for (let i = 0; i < data.length; i += 4) {
        // If pixel is not completely transparent and not white
        if (data[i + 3] > 0 && !(data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255)) {
          // Make it white
          ctx.fillStyle = 'white';
          const x = (i / 4) % size;
          const y = Math.floor((i / 4) / size);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not create blob from canvas'));
          return;
        }
        
        // Create File object
        const file = new File([blob], 'sketch.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 1.0); // Use maximum quality for JPEG
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = dataURL;
  });
}

// Helper function to download the sketch
const downloadSketch = (sketchFile: File) => {
  const url = URL.createObjectURL(sketchFile);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sketch-input.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export async function generateImageFromSketch(sketchDataUrl: string, prompt: string): Promise<ArrayBuffer> {
  if (!API_TOKEN) {
    throw new Error('ClipDrop API token not found. Please check your environment variables.');
  }

  try {
    console.log('🎨 Processing sketch...');
    const sketchFile = await dataURLToSketchFile(sketchDataUrl);
    
    // Download the sketch for testing
    downloadSketch(sketchFile);

    console.log('🚀 Sending request to ClipDrop API...', { prompt });
    
    const formData = new FormData();
    formData.append('sketch_file', sketchFile);
    formData.append('prompt', prompt);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_TOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ClipDrop API error: ${response.status} ${errorText}`);
    }

    console.log('✅ Successfully received response from ClipDrop');
    
    // Return the response as an ArrayBuffer
    return await response.arrayBuffer();

  } catch (error: any) {
    console.error('❌ Error in generateImageFromSketch:', error);
    throw error;
  }
}
