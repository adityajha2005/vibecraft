'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  IoAdd, 
  IoRemove, 
  IoCamera, 
  IoVideocam, 
  IoVideocamOff,
  IoDownloadOutline,
  IoSparklesOutline,
  IoCopyOutline,
  IoExpand,
  IoSettings,
  IoHome
} from 'react-icons/io5'
import SettingsModal from '@/components/SettingsModal'
import type { ImageSettings } from '@/components/SettingsModal'

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    seed: Math.floor(Math.random() * 1000000),
    shape: 'square',
    size: '1024x1024',
    style: 'natural',
    quality: 'standard',
    negativePrompt: ''
  })

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

  return (
    <div className="h-screen w-full relative bg-slate-50 overflow-hidden">
      <div className="w-full h-full relative">
        {/* Toolbar */}
        <div className="fixed top-0 left-0 right-0 h-auto min-h-[56px] bg-white border-b shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:px-6 z-10">
          {/* Left Tool Group */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            <Link href="/">
              <button className="p-2.5 hover:bg-slate-100 rounded-xl flex items-center">
                <IoHome className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setScale(scale => scale + 0.1)}
                className="p-2.5 hover:bg-slate-100 rounded-xl flex items-center"
              >
                <IoAdd className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
              <button 
                onClick={() => setScale(scale => Math.max(0.5, scale - 0.1))}
                className="p-2.5 hover:bg-slate-100 rounded-xl flex items-center"
              >
                <IoRemove className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Tool Groups - Image Actions */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end mt-2 sm:mt-0">
            <button
              onClick={handleDownload}
              disabled={!displayImage}
              className="p-2.5 hover:bg-slate-100 rounded-xl flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
              title="Download Image"
            >
              <IoDownloadOutline className="w-5 h-5" />
              Download
            </button>

            <button
              onClick={() => setIsEnhancing(true)}
              disabled={!displayImage || isEnhancing}
              className="p-2.5 hover:bg-slate-100 rounded-xl flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
              title="Enhance Image"
            >
              <IoSparklesOutline className="w-5 h-5" />
              {isEnhancing ? 'Enhancing...' : 'Enhance'}
            </button>

            <button
              onClick={() => {/* Generate variations logic */}}
              disabled={!displayImage}
              className="p-2.5 hover:bg-slate-100 rounded-xl flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
              title="Generate Variations"
            >
              <IoCopyOutline className="w-5 h-5" />
              Variations
            </button>

            <div className="h-6 border-l mx-2" />

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 hover:bg-slate-100 rounded-xl"
              title="Image Settings"
            >
              <IoSettings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <motion.div 
          className="w-full h-[calc(100vh-72px)] sm:h-[calc(100vh-56px)] mt-[72px] sm:mt-14 relative"
          drag
          dragMomentum={false}
        >
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundSize: '40px 40px',
              backgroundImage: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
              transform: `scale(${scale})`,
              transformOrigin: '0 0'
            }}
          >
            {/* Image Display Area */}
            {displayImage && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img 
                  src={displayImage} 
                  alt="Generated" 
                  className="max-w-[500px] rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </motion.div>

        {variations.length > 0 && (
          <div className="fixed left-4 top-16 bg-white p-2 rounded-lg shadow-lg">
            <h3 className="text-sm font-semibold mb-2">Variations</h3>
            <div className="flex gap-2">
              {variations.map((variation, index) => (
                <img
                  key={index}
                  src={variation}
                  alt={`Variation ${index + 1}`}
                  className="w-20 h-20 object-cover rounded cursor-pointer hover:ring-2 ring-black"
                  onClick={() => setDisplayImage(variation)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Panel with Camera and Prompt */}
      <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[380px] flex flex-col gap-4 p-4 sm:p-0">
            {/* camera preview  */}
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
            {/* Facial Recognition Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* face detection overlay */}
            </div>
          </div>
        </div>
                {/* Prompt area */}
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={imageSettings}
        onSettingsChange={setImageSettings}
      />
    </div>
  )
}

export default Dashboard