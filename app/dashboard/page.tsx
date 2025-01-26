'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Toolbar from '@/components/dashboard/Toolbar'
import SketchCanvas from '@/components/dashboard/SketchCanvas'
import CameraPanel from '@/components/dashboard/CameraPanel'
import PromptPanel from '@/components/dashboard/PromptPanel'
import SettingsModal from '@/components/SettingsModal'
import type { ImageSettings } from '@/components/SettingsModal'
import Footer from '@/components/dashboard/Footer'
import SketchFeatures from '@/components/dashboard/SketchFeatures'
import { generateImageFromSketch } from '@/lib/sketch-to-image'

const Dashboard = () => {
  const [scale, setScale] = useState(1)
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [displayImage, setDisplayImage] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState('select')
  const [activeColor, setActiveColor] = useState('#000000')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [variations, setVariations] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    seed: Math.floor(Math.random() * 1000000),
    shape: 'square',
    size: '1024x1024',
    style: 'natural',
    quality: 'standard',
    negativePrompt: ''
  })
  const [isSketchMode, setIsSketchMode] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [isCameraMinimized, setIsCameraMinimized] = useState(false)
  const [isPromptMinimized, setIsPromptMinimized] = useState(false)

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      setHistory(prev => [...prev, prompt])
      setPrompt('')
    }
  }

  const handleDownload = () => {
    if (displayImage) {
      const link = document.createElement('a')
      link.href = displayImage
      link.download = 'generated-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleGenerateFromSketch = async (sketchDataUrl: string, prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await generateImageFromSketch(sketchDataUrl, prompt);
      const imageUrl = URL.createObjectURL(response);
      setGeneratedImage(imageUrl);
      setDisplayImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert("An error occurred while generating the image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

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

      <div className="fixed bottom-16 sm:bottom-20 right-0 sm:right-6 w-full sm:w-[380px] flex flex-col gap-4 p-4 sm:p-0 z-50">
        <CameraPanel 
          isCameraActive={isCameraActive}
          setIsCameraActive={setIsCameraActive}
          isMinimized={isCameraMinimized}
          onMinimize={() => setIsCameraMinimized(!isCameraMinimized)}
        />
        <PromptPanel 
          prompt={prompt}
          setPrompt={setPrompt}
          history={history}
          handlePromptSubmit={handlePromptSubmit}
          isMinimized={isPromptMinimized}
          onMinimize={() => setIsPromptMinimized(!isPromptMinimized)}
        />
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
  )
}

export default Dashboard
