'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoVideocam, IoVideocamOff, IoCamera } from 'react-icons/io5'; // Import icons
import Toolbar from '@/components/dashboard/Toolbar';
import SketchCanvas from '@/components/dashboard/SketchCanvas';
import CameraPanel from '@/components/dashboard/CameraPanel';
import PromptPanel from '@/components/dashboard/PromptPanel';
import SettingsModal from '@/components/SettingsModal';
import type { ImageSettings } from '@/components/SettingsModal';
import Footer from '@/components/dashboard/Footer';
import SketchFeatures from '@/components/dashboard/SketchFeatures';
import { generateImageFromSketch } from '@/lib/sketch-to-image';


const Dashboard = () => {
  // State variables
  const [scale, setScale] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSketchMode, setIsSketchMode] = useState(false); // Missing state
  const [activeColor, setActiveColor] = useState('#000000'); // Missing state
  const [brushSize, setBrushSize] = useState(5); // Missing state
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    seed: Math.floor(Math.random() * 1000000),
    shape: 'square',
    size: '1024x1024',
    style: 'natural',
    quality: 'standard',
    negativePrompt: '',
  });

  // Fetch saved artworks for the current user
  const userId = 'user-id-here'; // Replace with actual user ID
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(`/api/artworks/user/${userId}`);
        const data = await response.json();
        if (data.length > 0) {
          setDisplayImage(data[0].image); // Display the first artwork
        }
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
      }
    };
    fetchArtworks();
  }, [userId]);

  // Handle prompt submission
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setHistory((prev) => [...prev, prompt]);

      // Call the backend to generate an image from the prompt
      try {
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, ...imageSettings }), // Include image settings
        });
        const data = await response.json();
        setDisplayImage(data.imageUrl); // Set the generated image
      } catch (error) {
        console.error('Failed to generate image:', error);
        alert('Failed to generate image. Please try again.');
      }

      setPrompt('');
    }
  };

  // Handle saving artwork
  const handleSaveArtwork = async () => {
    if (displayImage) {
      try {
        const response = await fetch('/api/artworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Artwork ${history.length + 1}`,
            image: displayImage,
            userId,
          }),
        });
        const data = await response.json();
        console.log('Artwork saved:', data);
        alert('Artwork saved successfully!');
      } catch (error) {
        console.error('Failed to save artwork:', error);
        alert('Failed to save artwork. Please try again.');
      }
    }
  };

  // Handle downloading artwork
  const handleDownload = () => {
    if (displayImage) {
      const link = document.createElement('a');
      link.href = displayImage;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No image to download.');
    }
  };


  const handleGenerateFromSketch = async (sketchDataUrl: string, prompt: string) => {
    setIsGenerating(true);
    try {
      const result = await generateImageFromSketch(sketchDataUrl, prompt);
      const imageUrl = URL.createObjectURL(result);
      setGeneratedImage(imageUrl);
      setDisplayImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('An error occurred while generating the image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle camera activation
  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const videoElement = document.querySelector('video');
          if (videoElement) {
            videoElement.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          alert('Failed to access camera. Please ensure permissions are granted.');
        });
    }
  }, [isCameraActive]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-slate-50 overflow-y-auto">
      <Toolbar
        scale={scale}
        setScale={setScale}
        isSketchMode={isSketchMode}
        setIsSketchMode={setIsSketchMode}
        displayImage={displayImage}
        isEnhancing={isEnhancing}
        setIsEnhancing={setIsEnhancing}
        setIsSettingsOpen={setIsSettingsOpen}
        handleDownload={handleDownload}
      />

      <motion.div className="w-full min-h-[calc(100vh-72px)] mt-[72px] sm:mt-14 relative">
        {isSketchMode ? (
          <SketchCanvas
            activeColor={activeColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            setActiveColor={setActiveColor}
            onGenerate={handleGenerateFromSketch}
            isGenerating={isGenerating}
          />

        ) : (
          displayImage && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={displayImage}
                alt="Generated"
                className="max-w-[800px] rounded-lg shadow-lg"
              />
            </div>
          )
        )}
      </motion.div>

      {/* Floating Panel with Camera and Prompt */}
      <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[380px] flex flex-col gap-4 p-4 sm:p-0">
        {/* Camera Preview */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-3 sm:p-4 border-b flex justify-between items-center">
            <h2 className="text-sm sm:text-base font-semibold">Camera Preview</h2>
            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              className={`p-2 rounded-md ${isCameraActive ? 'bg-red-500 text-white' : 'bg-slate-100'}`}
            >
              {isCameraActive ? <IoVideocamOff /> : <IoVideocam />}
            </button>
          </div>

          <div className="aspect-video relative bg-slate-900 overflow-hidden">
            {isCameraActive ? (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <IoCamera size={24} />
              </div>
            )}
            {/* Facial Recognition Overlay (to be implemented) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Face detection overlay */}
            </div>
          </div>
        </div>

        {/* Prompt Area */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col max-h-[350px] sm:max-h-[450px]">
          <div className="p-3 sm:p-4 border-b flex justify-between items-center">
            <h2 className="text-sm sm:text-base font-semibold">Prompt Assistant</h2>
            <span className="text-xs sm:text-sm text-slate-500">{history.length} prompts</span>
          </div>

          <div className="flex-1 overflow-auto p-2 sm:p-3 max-h-[200px] sm:max-h-[250px]">
            {history.map((item, index) => (
              <div key={index} className="p-2 sm:p-3 bg-slate-50 rounded-lg mb-2 text-xs sm:text-sm">
                {item}
              </div>
            ))}
          </div>

          <form onSubmit={handlePromptSubmit} className="p-3 sm:p-4 border-t">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full p-2 sm:p-3 border rounded-xl resize-none h-[80px] sm:h-[100px] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black-500"
            />
            <button
              type="submit"
              className="mt-2 sm:mt-3 w-full bg-black text-white py-2 sm:py-2.5 rounded-xl hover:bg-black text-xs sm:text-sm font-medium transition-colors"
            >
              Generate Image
            </button>
          </form>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={imageSettings}
        onSettingsChange={setImageSettings}
      />

      <div className="mb-8">
        <SketchFeatures />
      </div>
      <Footer />
    </div>
  );
};


export default Dashboard
